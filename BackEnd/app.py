from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORSを有効にする

# サンプルの店舗データ
stores = {
    1: {"name": "レストランA", "location": "東京", "rating": 4.5},
    2: {"name": "カフェB", "location": "大阪", "rating": 4.0},
    3: {"name": "バーC", "location": "名古屋", "rating": 4.2},
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
    message = data.get('message')

    # データを処理 (ここでは単純に受信データを返すだけ)
    print(f"店舗ID: {store_id}, メッセージ: {message}")

    # 返答
    return jsonify({
        "status": "success",
        "storeId": store_id,
        "message": message
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Flaskサーバーを5000ポートで実行
