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
