import streamlit as st
import datetime

# --- ページ設定 ---
st.set_page_config(layout="centered", page_title="保育園 着替え管理")

# --- 定数 ---
CLOTHING_ITEMS = [
    {"key": "undershirt", "label": "肌着"},
    {"key": "short_sleeve", "label": "上着(半袖)"},
    {"key": "long_sleeve", "label": "上着(長袖)"},
    {"key": "pants", "label": "ズボン"},
]

# --- セッションステート初期化 ---
def init_state():
    if "stock" not in st.session_state:
        st.session_state.stock = {item["key"]: 3 for item in CLOTHING_ITEMS}
    if "taken" not in st.session_state:
        st.session_state.taken = {item["key"]: 0 for item in CLOTHING_ITEMS}
    if "checked" not in st.session_state:
        st.session_state.checked = {item["key"]: 3 for item in CLOTHING_ITEMS}

init_state()

# --- ページ選択 ---
pages = {
    "持っていくべき着替えの枚数": "check_needed",

import streamlit as st
from page_check_needed import page_check_needed
from page_register_stock import page_register_stock
from page_register_taken import page_register_taken
from constants import CLOTHING_ITEMS

# --- セッションステート初期化 ---
def init_state():
    if "stock" not in st.session_state:
        st.session_state.stock = {item["key"]: 3 for item in CLOTHING_ITEMS}
    if "taken" not in st.session_state:
        st.session_state.taken = {item["key"]: 0 for item in CLOTHING_ITEMS}
    if "checked" not in st.session_state:
        st.session_state.checked = {item["key"]: 3 for item in CLOTHING_ITEMS}

init_state()

pages = {
    "持っていくべき着替えの枚数": page_check_needed,
    "保育園にある着替えの枚数を登録": page_register_stock,
    "持ち帰ってきた着替えを登録": page_register_taken,
}
page = st.sidebar.radio("画面を選択", list(pages.keys()))

pages[page]()
# --- ページごとのUI ---

if pages[page] == "check_needed":

