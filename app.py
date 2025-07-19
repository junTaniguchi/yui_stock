import streamlit as st
from page_check_needed import page_check_needed
from page_register_stock import page_register_stock
from page_register_taken import page_register_taken
from page_top import page_top
from constants import CLOTHING_ITEMS


st.set_page_config(layout="centered", page_title="保育園 着替え管理")

# --- 楽しい雰囲気の背景CSS ---
st.markdown(
    """
    <style>
    body, .stApp {
        background: linear-gradient(135deg, #f9e7fe 0%, #e0f7fa 100%) !important;
        min-height: 100vh;
        color: #222 !important;
    }
    .stApp {
        position: relative;
    }
    .bg-illust {
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        pointer-events: none;
        z-index: 0;
    }
    /* Streamlitの各種テキスト要素も黒系に強制 */
    .stMarkdown, .stText, .stTitle, .stHeader, .stSubheader, .stCaption, .stMetric, .stAlert, .stDataFrame, .stNumberInput, .stSelectbox, .stInfo, .stSuccess, .stError, .stWarning {
        color: #222 !important;
    }
    /* ボタンの文字色は白 */
    .stButton>button, .stDownloadButton>button {
        color: #fff !important;
    }
    /* ラジオボタンのラベルは黒 */
    .stRadio label {
        color: #222 !important;
    }
    </style>
    <div class="bg-illust">
      <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;opacity:0.13;">
        <ellipse cx="60" cy="60" rx="50" ry="20" fill="#ffd1dc"/>
        <ellipse cx="350" cy="120" rx="60" ry="25" fill="#b2ebf2"/>
        <ellipse cx="200" cy="180" rx="90" ry="18" fill="#ffe082"/>
        <ellipse cx="320" cy="40" rx="30" ry="12" fill="#b2dfdb"/>
        <ellipse cx="100" cy="160" rx="40" ry="14" fill="#f8bbd0"/>
        <ellipse cx="250" cy="60" rx="25" ry="10" fill="#c5e1a5"/>
      </svg>
    </div>
    """,
    unsafe_allow_html=True
)

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

