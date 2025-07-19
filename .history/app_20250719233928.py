import streamlit as st
from page_check_needed import page_check_needed
from page_register_stock import page_register_stock
from page_register_taken import page_register_taken
from page_top import page_top
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
    if "page" not in st.session_state:
        st.session_state.page = "top"

init_state()

pages = {
    "top": page_top,
    "check_needed": page_check_needed,
    "register_stock": page_register_stock,
    "register_taken": page_register_taken,
}

# ページ遷移
pages[st.session_state.page]()

# 各ページから戻るボタンでTOPに戻るUIを追加
if st.session_state.page != "top":
    if st.button("TOPに戻る", use_container_width=True):
        st.session_state.page = "top"

