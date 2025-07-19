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

# サイドバーでページ遷移（ハンバーガーメニュー風）
with st.sidebar:
    st.markdown("## メニュー")
    page_labels = {
        "top": "TOP",
        "check_needed": "翌日持っていくべき着替えの枚数",
        "register_stock": "保育園にある着替えの枚数を登録",
        "register_taken": "持ち帰ってきた着替えを登録",
    }
    selected = st.radio("画面を選択", list(page_labels.keys()), format_func=lambda k: page_labels[k], index=list(pages.keys()).index(st.session_state.page))
    st.session_state.page = selected

pages[st.session_state.page]()

