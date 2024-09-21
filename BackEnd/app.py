from flask import Flask, jsonify, request
from flask_cors import CORS

from app.services.crowd_service import make_answer
#import app.services.img_dwnlder 

app = Flask(__name__)
CORS(app)  # CORSを有効にする

# サンプルの店舗データ
stores = {
    1: {"name": "レストランA", "location": "東京", "rating": 4.5},
    2: {"name": "カフェB", "location": "大阪", "rating": 4.0},
    3: {"name": "バーC", "location": "名古屋", "rating": 4.2},
}

template_questions = {
    "テーブルが広い席はありますか？":1,
    "ソファーや快適な椅子はありますか？":2,
    "窓際や自然光が入る席はありますか？":0,
    "利用されている年齢層の方はどれくらいですか？":3
}


# 店を選ぶ処理
@app.route('/select_store', methods=['POST'])
def select_store():
    data = request.json  # Reactから送られたJSONデータを取得
    store_id = data.get('store_id')

    if store_id in stores:
        return jsonify({"message": f"店 {stores[store_id]['name']} が選ばれました。"})
    else:
        return jsonify({"error": "店が見つかりませんでした。"}), 404


# 店の詳細を受け取るエンドポイント
@app.route('/api/store-details', methods=['POST'])
def receive_store_details():
    data = request.json
    store_id = data.get('storeId')
    store_name = data.get('storeName')
    location = data.get('location')
    message = data.get('message')
    
    store_name = "image" # 今は店名はこれだけなので
    message_key = template_questions[message]
    
    answer = make_answer(message_key, store_name)
    return jsonify({"status": "success", "storeId": store_id, "message": answer})


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Flaskサーバーを5000ポートで実行
