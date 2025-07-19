import pyrebase
import streamlit as st

firebase_config = {
    "apiKey": "AIzaSyAUHszKFF-jN6l1r_HZp_XjgHlRgJo4X-o",
    "authDomain": "yui-stock.firebaseapp.com",
    "projectId": "yui-stock",
    "storageBucket": "yui-stock.firebasestorage.app",
    "messagingSenderId": "704142178477",
    "appId": "1:704142178477:web:3bbeec9fec066594ee6e24",
    "measurementId": "G-C7VNDRR61M"
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

def login(email, password):
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return user
    except Exception as e:
        st.error("ログインに失敗しました")
        return None