import firebase_admin
from firebase_admin import credentials, firestore
import streamlit as st
import json

# SecretsからJSON文字列を取得
service_account_info = json.loads(st.secrets["FIREBASE_SERVICE_ACCOUNT"])

# Firebase初期化（2重初期化防止）
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# --- 共通データの保存・取得 ---
COLLECTION = "app_data"
DOC_ID = "global"  # 全体共通データ

def save_app_data(stock, taken, checked):
    db.collection(COLLECTION).document(DOC_ID).set({
        "stock": stock,
        "taken": taken,
        "checked": checked
    })

def load_app_data():
    doc = db.collection(COLLECTION).document(DOC_ID).get()
    if doc.exists:
        data = doc.to_dict()
        return data.get("stock"), data.get("taken"), data.get("checked")
    else:
        return None, None, None
