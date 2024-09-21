import os
import base64
import requests
from dotenv import load_dotenv
from .img_dwnlder import recent_img_dwnld
import ast
import re
from pathlib import Path
# 現在のディレクトリから2つ上の階層にある.envファイルのパスを取得
env_path = Path(__file__).resolve().parents[2] / '.env'

# .envファイルを読み込む
load_dotenv(dotenv_path=env_path)

MODEL = "gpt-4o-mini"
api_key = os.getenv('api_key')

# Function to encode the image
def encode_image(img_content):
    return base64.b64encode(img_content).decode('utf-8')

def resp_img_question(storeName, question):
    img_content = recent_img_dwnld(storeName)

    # Getting the base64 string
    base64_image = encode_image(img_content)

    headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
    }

    full_question = f"「{question}」"+"次の画像に対するこの質問への返答として評価種類と評価値を次のJSONファイル形式の文字列を埋める形で返答してください: {'評価名': (), '評価値': ()} ただし、評価値は数値とは限らないので適切な形式の返し値としてください"

    payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": full_question
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    
    message = response.json()['choices'][0]['message']['content']
    formed_message = re.search(r'\{.*?\}', message)
    texted_message = formed_message.group()
    dicted_message = ast.literal_eval(texted_message)
    return dicted_message

if __name__ == '__main__':
    print(resp_img_question("image", "honyanay"))
    pass