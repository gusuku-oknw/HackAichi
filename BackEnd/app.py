from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

# from BackEnd.services.crowd_service import make_answer
from BackEnd.services import analysis
from BackEnd.services import crowd_service
# import app.services.img_dwnlder

application = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
CORS(application)  # CORSを有効にする

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


@application.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello, world!"}), 200


# 店を選ぶ処理
@application.route('/api/store-search', methods=['POST', 'GET'])
def get_cafes():
    try:
        cafe_data = analysis.fetch_cafe_data(nagoya_station)
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to fetch cafe data: {str(e)}"}), 500

    return jsonify(cafe_data), 200


# 店の詳細を受け取るエンドポイント
@application.route('/api/store-details', methods=['POST', 'GET'])
def receive_store_details():
    try:
        if not request.is_json:
            return jsonify({"status": "error", "message": "Invalid JSON format"}), 400

        data = request.json
        store_id = data.get('storeId')
        store_name = data.get('storeName')
        location = data.get('location')
        message = data.get('message')

        if not all([store_id, store_name, location, message]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        test_name = "image"

        try:
            answer = crowd_service.make_answer(message, test_name)
        except Exception as e:
            return jsonify({"status": "error", "message": f"Failed to generate answer: {str(e)}"}), 500

        return jsonify({"status": "success", "storeId": store_id, "message": answer}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": f"Internal server error: {str(e)}"}), 500


@application.route('/')
def index():
    return render_template('index.html')


# @app.errorhandler(404)
# def page_not_found(e):
#     return jsonify({"status": "error", "message": "Resource not found"}), 404


if __name__ == '__main__':
    application.run(debug=True)  # Flaskサーバーを5000ポートで実行
    # app.run(host='0.0.0.0', port=5000)
