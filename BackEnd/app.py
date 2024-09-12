from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Reactとの連携を許可するためにCORSを有効にします

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


# 対話形式で店の詳細を知る処理
@app.route('/store_details', methods=['POST'])
def store_details():
    data = request.json  # Reactから送られたJSONデータを取得
    store_id = data.get('store_id')
    question = data.get('question')  # ユーザーからの質問

    store = stores.get(store_id)

    if not store:
        return jsonify({"error": "店の詳細が見つかりませんでした。"}), 404

    # 対話形式の処理 (簡単な例: 質問によって返す情報を変える)
    if "場所" in question:
        return jsonify({"response": f"{store['name']}は{store['location']}にあります。"})
    elif "評価" in question:
        return jsonify({"response": f"{store['name']}の評価は{store['rating']}です。"})
    else:
        return jsonify({"response": f"{store['name']}に関する情報: {store}"})


if __name__ == '__main__':
    app.run(debug=True)
