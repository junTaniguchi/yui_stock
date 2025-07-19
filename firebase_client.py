import firebase_admin
from firebase_admin import credentials, firestore
import os

# サービスアカウントキーのパス
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "yui-stock-firebase-adminsdk-fbsvc-e789e48bbc.json")

# Firebase初期化（2重初期化防止）
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()
