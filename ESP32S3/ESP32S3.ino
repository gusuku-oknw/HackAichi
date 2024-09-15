#include "esp_camera.h"
#include <WiFi.h>
#define CAMERA_MODEL_ESP32S3_EYE // Has PSRAM
#include "camera_pins.h"
#include <HTTPClient.h>
#include "ArduinoJson.h"
#include <Base64.h>  // For Base64 encoding
#include "credentials.h"
#include <time.h>    // For time functions
#include <WebServer.h> // Web server library
#include <esp_timer.h> // For timer functionality

String apiUrl;
String uploadUrl;
String authToken;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600; // Adjust according to your timezone
const int daylightOffset_sec = 3600;

WebServer server(80); // Create a web server object that listens on port 80

// Variables for periodic capture
const int captureInterval = 10 * 60 * 100; // Interval in milliseconds (e.g., 10 minutes)
bool isAuthorized = false; // Flag to indicate if B2 authorization was successful

// WiFi connection function
void connectToWiFi() {
  WiFi.begin(ssid, password);
  WiFi.setSleep(false); // Disable WiFi sleep
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// NTP time initialization
void initTime() {
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Fetching time from NTP server...");
  delay(2000);
}

// Get current date and time for filename
String getFileName() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "image.jpg"; // Default name if time not available
  }

  char buffer[30];
  strftime(buffer, sizeof(buffer), "image_%Y%m%d_%H%M%S.jpg", &timeinfo); // YYYYMMDD_HHMMSS.jpg
  return String(buffer);
}

// Initialize the camera
void initCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_XGA;
  config.pixel_format = PIXFORMAT_JPEG; // For streaming
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // Initialize the camera
  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera initialization failed");
    return;
  }
  Serial.println("Camera initialized successfully");

  sensor_t * s = esp_camera_sensor_get();
  // Adjust camera settings if needed
  s->set_vflip(s, 1); // Flip vertically
  s->set_brightness(s, 1); // Increase brightness
  s->set_saturation(s, 0); // Adjust saturation
}

// Function to authorize account and retrieve the API URL and auth token
bool b2AuthorizeAccount() {
  HTTPClient http;
  http.begin("https://api.backblazeb2.com/b2api/v2/b2_authorize_account");

  String auth = base64::encode(String(b2KeyId) + ":" + String(b2AppKey));
  http.addHeader("Authorization", "Basic " + auth);

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String response = http.getString();
    StaticJsonDocument<2048> doc; // Increased buffer size
    DeserializationError error = deserializeJson(doc, response);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      http.end();
      return false;
    }

    apiUrl = doc["apiUrl"].as<String>();
    authToken = doc["authorizationToken"].as<String>();

    Serial.println("B2 Authorization successful");
    http.end();
    return true;
  } else {
    Serial.printf("Authorization failed: %s\n", http.errorToString(httpResponseCode).c_str());
    http.end();
    return false;
  }
}

// Function to get the upload URL for a specific bucket
bool b2GetUploadUrl() {
  HTTPClient http;
  http.begin(apiUrl + "/b2api/v2/b2_get_upload_url");
  http.addHeader("Authorization", authToken);

  // Prepare the JSON payload
  String payload = "{\"bucketId\":\"" + String(b2BucketId) + "\"}";
  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    StaticJsonDocument<2048> doc; // Increased buffer size
    DeserializationError error = deserializeJson(doc, response);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      http.end();
      return false;
    }

    uploadUrl = doc["uploadUrl"].as<String>();
    authToken = doc["authorizationToken"].as<String>();  // Refresh token

    Serial.println("Upload URL retrieved successfully");
    http.end();
    return true;
  } else {
    Serial.printf("Failed to get upload URL: %s\n", http.errorToString(httpResponseCode).c_str());
    http.end();
    return false;
  }
}

// Function to upload image to B2
void uploadImageToB2(camera_fb_t *fb, String fileName) {
  if (!fb) {
    Serial.println("Failed to capture image");
    return;
  }

  HTTPClient http;
  http.begin(uploadUrl);
  http.addHeader("Authorization", authToken);
  http.addHeader("X-Bz-File-Name", fileName);  // Set the time-based file name
  http.addHeader("Content-Type", "b2/x-auto");    // Content type
  http.addHeader("X-Bz-Content-Sha1", "do_not_verify");  // Skip checksum verification for now

  int httpResponseCode = http.POST(fb->buf, fb->len);  // Upload the image

  if (httpResponseCode > 0) {
    Serial.printf("Image uploaded successfully as %s, response code: %d\n", fileName.c_str(), httpResponseCode);
  } else {
    Serial.printf("Upload failed: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// Handler for the root path "/"
void handleRoot() {
  String html = "<html><head><title>ESP32 Camera</title></head><body>";
  html += "<h1>ESP32 Camera Snapshot</h1>";
  html += "<img src=\"/capture\" width=\"640\" height=\"480\">";
  html += "<p><a href=\"/\">Refresh Image</a></p>";
  html += "<form action=\"/capture\" method=\"get\">";
  html += "<input type=\"hidden\" name=\"upload\" value=\"true\">";
  html += "<input type=\"submit\" value=\"Capture and Upload to B2\">";
  html += "</form>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// Handler for capturing and serving the image
void handleCapture() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    server.send(500, "text/plain", "Camera capture failed");
    return;
  }

  // Send image as response
  server.send_P(200, "image/jpeg", (const char *)fb->buf, fb->len);

  // Check if upload is requested
  if (server.hasArg("upload") && server.arg("upload") == "true") {
    String fileName = getFileName();  // Get the current time-based file name
    uploadImageToB2(fb, fileName);
  }

  esp_camera_fb_return(fb);
}

// Start the web server
void startCameraServer() {
  server.on("/", handleRoot);
  server.on("/capture", handleCapture);
  server.begin();
  Serial.println("HTTP server started");
}

// Function to capture and upload image automatically
void captureAndUpload() {
  if (!isAuthorized) {
    // Try to authorize and get upload URL
    isAuthorized = b2AuthorizeAccount() && b2GetUploadUrl();
    if (!isAuthorized) {
      Serial.println("Failed to authorize B2 account or get upload URL");
      return;
    }
  }

  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Failed to capture image");
    return;
  }

  String fileName = getFileName();  // Get the current time-based file name
  uploadImageToB2(fb, fileName);

  esp_camera_fb_return(fb);
}

// Timer callback function
void onTimer(void* arg) { // Modified to accept void* argument
  captureAndUpload();
}

// Initialize and start the timer
void initTimer() {
  esp_timer_create_args_t timerArgs = {};
  timerArgs.callback = &onTimer;
  esp_timer_handle_t periodicTimer;
  esp_err_t err = esp_timer_create(&timerArgs, &periodicTimer);
  if (err == ESP_OK) {
    esp_timer_start_periodic(periodicTimer, captureInterval * 1000ULL); // Convert to microseconds
    Serial.println("Periodic capture timer started");
  } else {
    Serial.println("Failed to create timer");
  }
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initTime();  // Initialize NTP and get the current time
  initCamera();

  // Authorize B2 account and get upload URL
  isAuthorized = b2AuthorizeAccount() && b2GetUploadUrl();
  if (!isAuthorized) {
    Serial.println("Failed to authorize B2 account or get upload URL");
  }

  // Start the web server
  startCameraServer();

  // Initialize and start the periodic capture timer
  initTimer();
}

void loop() {
  server.handleClient();
  delay(10); // Adjust delay as needed
}
