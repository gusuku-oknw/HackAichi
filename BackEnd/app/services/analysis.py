import requests
import os
from dotenv import load_dotenv
import json
from app.services.chatgpt_analysis import analyze_image_with_gpt

# .env ファイルから環境変数を読み込む
load_dotenv('.env')

# Google Maps APIキーを環境変数から取得
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# カフェを検索する範囲（メートル）
radius = 500

# 検索するカフェの数
num_cafes = 5


# 名駅近くのカフェを検索
def search_cafes(location, radius, api_key):
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': f"{location['latitude']},{location['longitude']}",
        'radius': radius,
        'type': 'cafe',
        'key': api_key
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json().get('results', [])
    return []


# カフェの詳細と画像を取得
def get_cafe_details(place_id, api_key):
    base_url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        'place_id': place_id,
        'fields': 'name,geometry,photos',
        'key': api_key
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json().get('result', {})
    return {}


# 画像URLを取得
def get_photo_url(photo_reference, api_key, max_width=400):
    return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={api_key}"


# カフェ情報を取得して保存
def fetch_cafe_data_save(current_location, save_directory='data', filename='cafes_data.json'):
    # 名駅周辺のカフェを検索
    cafes = search_cafes(current_location, radius, GOOGLE_MAPS_API_KEY)
    cafe_data_list = []

    # 保存先ディレクトリを作成（存在しない場合）
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # 保存先パスを作成
    filepath = os.path.join(save_directory, filename)

    for i, cafe in enumerate(cafes[:num_cafes]):
        place_id = cafe['place_id']
        cafe_details = get_cafe_details(place_id, GOOGLE_MAPS_API_KEY)

        # カフェの名前、位置情報、画像リストを取得
        cafe_name = cafe_details.get('name', 'Unknown Cafe')
        photos = cafe_details.get('photos', [])
        location = cafe_details.get('geometry', {}).get('location', {})

        # 各カフェから最大5枚の画像URLを取得
        photo_urls = [get_photo_url(photo['photo_reference'], GOOGLE_MAPS_API_KEY) for photo in photos[:5]]

        # 画像のURLを解析
        analysis_result = analyze_image_with_gpt(*photo_urls[:5])

        # カフェ情報を追加（写真も含む）
        cafe_data = {
            "storeId": f"user_{i + 1}",
            "storeName": cafe_name,
            "location": {
                "latitude": location.get('lat', current_location['latitude']),
                "longitude": location.get('lng', current_location['longitude'])
            },
            "message": analysis_result
        }
        cafe_data_list.append(cafe_data)

    # JSONファイルとして指定されたパスに保存
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cafe_data_list, f, ensure_ascii=False, indent=4)
    print(f"カフェデータが '{filepath}' に保存されました。")


# カフェデータを取得して保存する関数
def fetch_cafe_data(current_location):
    cafes = search_cafes(current_location, radius, GOOGLE_MAPS_API_KEY)
    cafe_data_list = []

    for i, cafe in enumerate(cafes[:num_cafes]):
        place_id = cafe['place_id']
        cafe_details = get_cafe_details(place_id, GOOGLE_MAPS_API_KEY)

        # カフェの名前、位置情報、画像リストを取得
        cafe_name = cafe_details.get('name', 'Unknown Cafe')
        photos = cafe_details.get('photos', [])
        location = cafe_details.get('geometry', {}).get('location', {})

        # 各カフェから最大5枚の画像URLを取得
        photo_urls = [get_photo_url(photo['photo_reference'], GOOGLE_MAPS_API_KEY) for photo in photos[:5]]

        # 画像のURLを解析
        analysis_result = analyze_image_with_gpt(*photo_urls[:5])

        # カフェ情報を追加（写真も含む）
        cafe_data = {
            "id": f"user_{i + 1}",
            "name": cafe_name,
            "location": {
                "lat": location.get('lat', current_location['latitude']),
                "lng": location.get('lng', current_location['longitude'])
            },
            "description": analysis_result
        }
        cafe_data_list.append(cafe_data)

    print(cafe_data_list)

    return cafe_data_list


if __name__ == "__main__":
    # 保存先のディレクトリとファイル名を指定
    save_directory = 'app/services/jsons'  # 保存先のディレクトリ名
    filename = 'cafe_data.json'  # 保存するファイル名
    fetch_cafe_data()
