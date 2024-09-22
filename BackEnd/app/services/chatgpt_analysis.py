import json
from openai import OpenAI
from dotenv import load_dotenv
import os
from pathlib import Path


env_path = Path(__file__).resolve().parents[2] / '.env'
# .env ファイルから環境変数を読み込む
load_dotenv(dotenv_path=env_path)

# OpenAI APIキーを設定
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# カフェデータを読み込む
def load_cafe_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)


# GPT-4 Turbo with vision を使って画像を解析
def analyze_image_with_gpt(url1, url2, url3, url4, url5):
    # GPT-4 Turbo with vision を使った画像解析
    try:
        # 画像をアップロードして解析
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "画像から店の特徴と雰囲気を一文で簡潔に教えてください。例: 店内は明るく、いろんな種類の紅茶が飲めます。"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": url1,
                                "url": url2,
                                "url": url3,
                                "url": url4,
                                "url": url5
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"画像解析エラー: {e}")
        return "解析エラー"


# カフェデータを読み込み、各カフェの分析結果を生成
def analyze_cafes(input_filename='app/services/jsons/nagoya_cafes.json', save_directory='output',
                  output_filename='cafes_analysis_without_photos.json'):
    cafes = load_cafe_data(input_filename)
    cafe_analysis_list = []

    for cafe in cafes:
        # 画像のURLリストを取得
        photo_urls = cafe.get('photos', [])

        # 画像URLが足りない場合は空文字列で埋める
        photo_urls += [""] * (5 - len(photo_urls))

        # 画像のURLを解析
        analysis_result = analyze_image_with_gpt(*photo_urls[:5])

        # 分析結果を含むカフェ情報を追加（写真は含めない）
        cafe_data = {
            "storeId": cafe["id"],
            "storeName": cafe["name"],
            "location": cafe["location"],
            "message": analysis_result
        }

        cafe_analysis_list.append(cafe_data)

    # 保存先ディレクトリを作成（存在しない場合）
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # 保存先パスを作成
    filepath = os.path.join(save_directory, output_filename)

    # JSONファイルとして保存
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cafe_analysis_list, f, ensure_ascii=False, indent=4)
    print(f"分析結果が '{filepath}' に保存されました。")


if __name__ == "__main__":
    # 入力ファイル名、保存先ディレクトリ、保存ファイル名を指定
    input_filename = 'app/services/jsons/nagoya_cafes.json'  # 入力ファイルのパス
    save_directory = 'my_output_folder'  # 保存先のディレクトリ名
    output_filename = 'nagoya_cafes_analysis.json'  # 保存するファイル名

    # 関数を呼び出して解析を実行
    analyze_cafes(input_filename, save_directory, output_filename)
