import streamlit as st
import datetime


import streamlit as st
from page_check_needed import page_check_needed
from page_register_stock import page_register_stock
from page_register_taken import page_register_taken
from constants import CLOTHING_ITEMS

st.set_page_config(layout="centered", page_title="保育園 着替え管理")

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
from page_register_taken import page_register_taken

