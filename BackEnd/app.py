from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

from app.services.crowd_service import make_answer
from app.services.analysis import fetch_cafe_data

# import app.services.img_dwnlder

app = Flask(__name__, static_folder="./build/static", template_folder="./build")
CORS(app)  # CORSを有効にする

# サンプルの店舗データ
stores = {
    1: {"name": "レストランA", "location": "東京", "rating": 4.5},
    2: {"name": "カフェB", "location": "大阪", "rating": 4.0},
    3: {"name": "バーC", "location": "名古屋", "rating": 4.2},
}

# 名駅の座標（名古屋駅）
nagoya_station = {
    'latitude': 35.170915,
    'longitude': 136.881537
}


# 店を選ぶ処理
@app.route('/store-search', methods=['POST', 'GET'])
def get_cafes():
    cafe_data = fetch_cafe_data(nagoya_station)
    return jsonify(cafe_data), 200


# 店の詳細を受け取るエンドポイント
@app.route('/store-details', methods=['POST', 'GET'])
def receive_store_details():
    data = request.json
    store_id = data.get('storeId')
    store_name = data.get('storeName')
    location = data.get('location')
    message = data.get('message')

    ### テストコード ###
    # try:
    #     test_message = int(message)
    # except Exception as e:
    #     test_message = 3 # とりあえず質問を固定　後でフロントの形式を調整しつつこれにする。
    test_name = "image"  # 今は店名はこれだけなので

    answer = make_answer(message, test_name)
    return jsonify({"status": "success", "storeId": store_id, "message": answer}), 200


@app.route('/')
def index():
    return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
    return "Page not found", 404


if __name__ == '__main__':
    app.run(debug=True)  # Flaskサーバーを5000ポートで実行
    # app.run(host='0.0.0.0', port=5000)
