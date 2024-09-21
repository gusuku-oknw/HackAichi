import os
import requests
import base64
import ast
import re

from dotenv import load_dotenv
from pathlib import Path

from app.services.img_dwnlder import recent_img_dwnld
#from img_dwnlder import recent_img_dwnld # テストコード

# 現在のディレクトリから2つ上の階層にある.envファイルのパスを取得
env_path = Path(__file__).resolve().parents[2] / '.env'
# .envファイルを読み込む
load_dotenv(dotenv_path=env_path)
MODEL = "gpt-4o-mini"
api_key = os.getenv('api_key')

tanteki = "Please answer briefly."
forming = "Respond to the following question about the next image by filling in the types of evaluations and their values in the following JSON format string (Please answer the value part with short sentences in Japanese.): {'evaluation_name': (), 'evaluation_value': ()}. However, the evaluation value is not necessarily a numerical value, so please return an appropriate value in the appropriate format absolutely."
def init_question():
  question_dict = {}
  txts = []
  txts.append("Are there any seats by the window or where natural light comes in within the image?")
  txts.append("Are there any seats occupied by people among the seats you just found?")
  txts.append("Additionally, are there any seats with something on the table?")
  txts.append("Based on the above, are there any seats by the window or with natural light where no one is sitting and nothing is placed on the table?"+forming)
  question_dict[0] = txts

  txts = []
  txts.append("Are there any seats with wide tables in the image?")
  txts.append("Are there any seats occupied by people among the seats you just found?")
  txts.append("Additionally, are there any seats with something on the table?")
  txts.append("Based on the above, are there any seats with wide tables where no one is sitting and nothing is placed on the table?"+forming)
  question_dict[1] = txts

  txts = []
  txts.append("Are there seats with sofas or comfortable chairs in that image?")
  txts.append("Are there any seats occupied by people among the seats you just found?")
  txts.append("Additionally, are there any seats with something on the table?")
  txts.append("Based on the above, are there any seats with sofas or comfortable chairs that are unoccupied by people and have nothing on the table?"+forming)
  question_dict[2] = txts

  txts = []
  txts.append("What's the age range of the people using it?"+forming)
  question_dict[3] = txts

  return question_dict

question_dict = init_question()

# Function to encode the image
def encode_image(img_content):
  return base64.b64encode(img_content).decode('utf-8')

def read_image(image_path): # テスト関数
  with open(image_path, "rb") as image_file:
    return image_file.read()

def resp_img_question(question, base64_image):
  headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
  }

  payload = {
  "model": "gpt-4o-mini",
  "messages": [
      {
      "role": "user",
      "content": [
          {
          "type": "text",
          "text": question
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
  
  return response

def response_to_dict(response):
  message = response.json()['choices'][0]['message']['content']
  formed_message = re.search(r'\{.*?\}', message, re.DOTALL)
  texted_message = formed_message.group()
  dicted_message = ast.literal_eval(texted_message)    
  return dicted_message

def get_crowd_val(storeName="image"):
  question = "Please tell me the congestion level with a number between 1 and 5."+forming

  image_content = recent_img_dwnld(storeName)
  #image_content = read_image("/home/tatilin/work/HackAichi/BackEnd/imgs/image_20240917_100218.jpg") # テストコード

  base64_image = encode_image(image_content)
  response = resp_img_question(question, base64_image)
  dicted_message = response_to_dict(response)
  return int(dicted_message['evaluation_value'])

def make_answer(key, storeName="image", question_dict=question_dict):
  questions = question_dict[key]
  question_num = len(questions)
  image_content = recent_img_dwnld(storeName)
  #image_content = read_image("/home/tatilin/work/HackAichi/BackEnd/sumple_cafe3.jpg") # テストコード
  base64_image = encode_image(image_content)

  for i in range(question_num):
    response = resp_img_question(questions[i], base64_image)

  dicted_message = response_to_dict(response)
  return dicted_message['evaluation_value']

if __name__ == '__main__':
  print(get_crowd_val("image"))
  #print(resp_img_question("image", "honyanay"))
  pass