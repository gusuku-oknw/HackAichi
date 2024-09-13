#include "esp_camera.h"
#include <WiFi.h>
#define CAMERA_MODEL_ESP32S3_EYE // Has PSRAM
#include "camera_pins.h"
#include <HTTPClient.h>
#include "ArduinoJson.h"
#include <Base64.h>  // Base64エンコーディング用
#include "credentials.h"
#include <time.h>    // For time functions

String apiUrl;
String uploadUrl;
String authToken;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600; // Adjust according to your timezone
const int daylightOffset_sec = 3600;

// WiFi接続処理
void connectToWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("WiFiに接続中...");
  }
  Serial.println("WiFi接続成功！");
}

// NTPによる時刻取得処理
void initTime() {
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("NTPサーバーに接続して時刻を取得中...");
  delay(2000);
}

// 現在の日付と時刻を取得し、ファイル名として使用
String getFileName() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("時刻取得に失敗しました");
    return "image.jpg"; // 失敗した場合のデフォルト名
  }

  char buffer[30];
  strftime(buffer, sizeof(buffer), "image_%Y%m%d_%H%M%S.jpg", &timeinfo); // YYYYMMDD_HHMMSS.jpg
  return String(buffer);
}

// カメラの初期化
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
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG; // for streaming
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;
  
  // カメラ初期化
  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("カメラ初期化に失敗しました");
    return;
  }
  Serial.println("カメラ初期化成功");
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
    StaticJsonDocument<1024> doc;
    deserializeJson(doc, response);
    
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
    StaticJsonDocument<1024> doc;
    deserializeJson(doc, response);

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
void uploadImageToB2() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Failed to capture image");
    return;
  }

  String fileName = getFileName();  // Get the current time-based file name

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
  esp_camera_fb_return(fb);
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initTime();  // Initialize NTP and get the current time
  initCamera();

  if (b2AuthorizeAccount() && b2GetUploadUrl()) {
    uploadImageToB2();
  }
}

void loop() {
  uploadImageToB2();
  delay(600000);  // 10 minutes interval (600,000 milliseconds)
}
