import os
import requests
import base64
import ast
import re

from dotenv import load_dotenv

from BackEnd.services import img_dwnlder


# from img_dwnlder import recent_img_dwnld # テストコード

# .envファイルを読み込む
load_dotenv()  # .envファイルをロードする
MODEL = "gpt-4o-mini"
api_key = os.getenv('OPENAI_API_KEY')

tanteki = "Please answer briefly."
forming = "Respond to the following question about the next image by filling in the types of evaluations and their values in the following JSON format string (Please answer the value part with short polite sentences in Japanese.): {'evaluation_name': (), 'evaluation_value': ()}. However, the evaluation value is not necessarily a numerical value, so please return an appropriate value in the appropriate format."


def init_question():
    question_dict = {}
    txts = []
    txts.append("Are there any seats by the window or where natural light comes in within the image?")
    txts.append("Are there any seats occupied by people among the seats you just found?")
    txts.append("Additionally, are there any seats with something on the table?")
    txts.append(
        "Are there any seats by the window with natural light, where no one is sitting and nothing is on the table?" + forming)
    question_dict[0] = txts

    txts = []
    txts.append("Are there any seats with wide tables in the image?")
    txts.append("Are there any seats occupied by people among the seats you just found?")
    txts.append("Are there any seats with something on the table?")
    txts.append("Are there any seats with wide tables, where no one is sitting and nothing is on the table?" + forming)
    question_dict[1] = txts

    txts = []
    txts.append("Are there seats with sofas or comfortable chairs in the image?")
    txts.append("Are there any seats occupied by people among the seats you just found?")
    txts.append("Are there any seats with something on the table?")
    txts.append(
        "Are there any seats with sofas or comfortable chairs that are unoccupied and have nothing on the table?" + forming)
    question_dict[2] = txts

    txts = []
    txts.append("What's the age range of the people using it?" + forming)
    question_dict[3] = txts

    return question_dict


question_dict = init_question()


# Function to encode the image
def encode_image(img_content):
    return base64.b64encode(img_content).decode('utf-8')


def read_image(image_path):  # テスト関数
    with open(image_path, "rb") as image_file:
        return image_file.read()


def resp_img_question(question, base64_image, retries=3):
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
                    {"type": "text", "text": question},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ],
        "max_tokens": 300
    }

    for attempt in range(retries):
        try:
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt == retries - 1:
                raise


def response_to_dict(response):
    try:
        message = response.json().get('choices', [])[0].get('message', {}).get('content', '')
        print(f"Full response content: {message}")  # レスポンス全体を表示
        formed_message = re.search(r'\{.*?\}', message, re.DOTALL)

        if formed_message is None:
            print("No matching pattern found, returning default message.")
            return {"error": "No valid JSON object found in response."}

        texted_message = formed_message.group()

        dicted_message = ast.literal_eval(texted_message)
        print("Parsed message:", dicted_message)  # デバッグ用に辞書全体を表示
        return dicted_message
    except (KeyError, IndexError, SyntaxError, ValueError) as e:
        print(f"Error in parsing response: {e}")
        return {"error": f"Failed to parse response: {str(e)}"}


def get_crowd_val(storeName="image"):
    question = "Please tell me the congestion level with a number between 1 and 5." + forming

    image_content = img_dwnlder.recent_img_dwnld(storeName)
    # image_content = read_image("/home/tatilin/work/HackAichi/BackEnd/imgs/image_20240917_100218.jpg") # テストコード

    base64_image = encode_image(image_content)
    response = resp_img_question(question, base64_image)
    dicted_message = response_to_dict(response)
    return int(dicted_message['evaluation_value'])


# def adjust_answer(key, dicted_message):

def text_to_key(text):
    """
    送られてきた文章を question_dict のキーに変換する関数。
    """
    text_key_map = {
        "窓際や自然光が入る席はありますか？": 0,
        "テーブルが広い席はありますか？": 1,
        "ソファーや快適な椅子はありますか？": 2,
        "利用されている年齢層の方はどれくらいですか？": 3
    }
    return text_key_map.get(text, None)


def make_answer(key_or_text, storeName="image", question_dict=question_dict):
    # 文章が送られてきた場合、キーに変換
    if isinstance(key_or_text, str):
        key = text_to_key(key_or_text)
        if key is None:
            print(f"Text '{key_or_text}' does not match any known key.")
            return "Invalid text input or key not found"
    else:
        key = key_or_text

    try:
        questions = question_dict[key]
    except KeyError:
        print(f"Key '{key}' not found in question_dict")
        return "Default value or error handling"

    print("Questions to ask:", questions)  # デバッグ用に質問リストを表示

    try:
        image_content = img_dwnlder.recent_img_dwnld(storeName)
        base64_image = encode_image(image_content)
    except Exception as e:
        print(f"Error downloading or encoding image: {e}")
        return "Error in image processing"

    answers = []
    for question in questions:
        print("Asking question:", question)  # デバッグ用に現在の質問を表示
        try:
            response = resp_img_question(question, base64_image)
            dicted_message = response_to_dict(response)
            print("Response received:", dicted_message)  # デバッグ用に辞書メッセージを表示
            if 'evaluation_value' in dicted_message:
                answers.append(dicted_message['evaluation_value'])
            else:
                print("Key 'evaluation_value' not found in the response.")
                # answers.append("Default value or error handling")
        except Exception as e:
            print(f"Error during question processing: {e}")
            # answers.append("Error during question processing")

    return answers


# if __name__ == '__main__':
#     print(get_crowd_val("image"))
#     # print(resp_img_question("image", "honyanay"))
#     pass
