import requests
import base64
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# .envファイルのパスを指定して読み込む
load_dotenv('.env')

# 環境変数を利用する
B2_KEY_ID = os.getenv('B2_KEY_ID')
B2_APP_KEY = os.getenv('B2_APP_KEY')
BUCKET_ID = os.getenv('BUCKET_ID')
BUCKET_NAME = os.getenv('BUCKET_NAME')

def authorize_account():
    url = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account"
    credentials = base64.b64encode(f"{B2_KEY_ID}:{B2_APP_KEY}".encode()).decode()
    headers = {"Authorization": f"Basic {credentials}"}

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data['authorizationToken'], data['apiUrl'], data['downloadUrl']
    else:
        print("Failed to authorize account:", response.text)
        return None, None, None

def list_files(api_url, auth_token, bucket_id):
    url = f"{api_url}/b2api/v2/b2_list_file_names"
    headers = {"Authorization": auth_token}
    payload = {"bucketId": bucket_id, "maxFileCount": 1000}  # Adjust as needed

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json().get('files', [])
    else:
        print("Failed to list files:", response.text)
        return []

def get_most_recent_image(api_url, auth_token, bucket_name, store_name):
    files = list_files(api_url, auth_token, BUCKET_ID)
    
    # Filter files by store name and sort by date
    relevant_files = [f for f in files if f['fileName'].startswith(store_name)]
    
    if not relevant_files:
        print("No files found for store:", store_name)
        return None

    # Extract dates from file names and find the most recent one
    def extract_date(file_name):
        # Example format: StoreName_YYYYMMDD_HHMM.jpg
        try:
            parts = file_name.split('_')
            date_str = parts[1]
            time_str = parts[2].split('.')[0]
            return datetime.strptime(date_str + time_str, '%Y%m%d%H%M')
        except Exception as e:
            print(f"Error extracting date from file name: {file_name}, {e}")
            return None

    # Find the file with the most recent date
    most_recent_file = max(relevant_files, key=lambda file: extract_date(file['fileName']))
    
    return most_recent_file['fileName']

def download_file(download_url, auth_token, bucket_name, file_name):
    url = f"{download_url}/file/{bucket_name}/{file_name}"
    headers = {"Authorization": auth_token}

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        file_path = file_name  # Save the file with the same name locally
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f"File downloaded and saved as {file_path}")
        return file_path
    else:
        print("Failed to download file:", response.text)
        return None

def main(store_name):
    auth_token, api_url, download_url = authorize_account()
    if auth_token:
        print("Authorized successfully.")
        #most_recent_image = get_most_recent_image(api_url, auth_token, BUCKET_NAME, store_name) # テスト時はここをコメントアウト
        most_recent_image = "image.jpg"
        if most_recent_image:
            print(f"Most recent image for {store_name}: {most_recent_image}")
            downloaded_file = download_file(download_url, auth_token, BUCKET_NAME, most_recent_image)
            if downloaded_file:
                print(f"File {most_recent_image} downloaded successfully.")
        else:
            print("No images found for the specified store.")

if __name__ == '__main__':
    store_name = 'CafeBlue'  # Replace with the store name you want to search for
    main(store_name)


# ファイル名形式を変更するときはget_most_recent_imageを変更する
# Example format: StoreName_YYYYMMDD_HHMM.jpg
# _で区切る方式だと簡単に情報を抽出できる
# parts = file_name.split('_')
# date_str = parts[1]
# time_str = parts[2].split('.')[0]
# return datetime.strptime(date_str + time_str, '%Y%m%d%H%M')