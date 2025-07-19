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
    "保育園にある着替えの枚数を登録": "register_stock",
    "持ち帰ってきた着替えを登録": "register_taken",
}
page = st.sidebar.radio("画面を選択", list(pages.keys()))

# --- ヘルパー ---
def calc_needed(stock):
    return {k: max(0, 3 - v) for k, v in stock.items()}

def save_stock(new_stock):
    st.session_state.stock = new_stock.copy()

def save_taken(new_taken):
    st.session_state.taken = new_taken.copy()
    # 持ち帰り分を在庫から減算
    for k in st.session_state.stock:
        st.session_state.stock[k] = max(0, st.session_state.stock[k] - st.session_state.taken[k])

def save_checked(new_checked):
    st.session_state.checked = new_checked.copy()
    st.session_state.stock = new_checked.copy()

def reset_all():
    st.session_state.stock = {item["key"]: 3 for item in CLOTHING_ITEMS}
    st.session_state.taken = {item["key"]: 0 for item in CLOTHING_ITEMS}
    st.session_state.checked = {item["key"]: 3 for item in CLOTHING_ITEMS}

# --- ページごとのUI ---
if pages[page] == "check_needed":
    st.title("翌日持っていくべき着替えの枚数")
    needed = calc_needed(st.session_state.stock)
    cols = st.columns(4)
    for i, item in enumerate(CLOTHING_ITEMS):
        with cols[i]:
            st.metric(item["label"], f"{needed[item['key']]} 枚")
            if needed[item["key"]] > 0:
                st.markdown("<span style='color:orange;'>持っていく必要あり</span>", unsafe_allow_html=True)
            else:
                st.markdown("<span style='color:gray;'>必要なし</span>", unsafe_allow_html=True)
    st.button("全てリセット", on_click=reset_all)

elif pages[page] == "register_stock":
    st.title("保育園にある着替えの枚数を登録")
    new_checked = {}
    for item in CLOTHING_ITEMS:
        new_checked[item["key"]] = st.number_input(
            f"{item['label']}の在庫", min_value=0, max_value=3, value=st.session_state.checked[item["key"]], key=f"checked_{item['key']}"
        )
    if st.button("在庫を登録・更新"):
        save_checked(new_checked)
        st.success("在庫を更新しました")

elif pages[page] == "register_taken":
    st.title("持ち帰ってきた着替えを登録")
    new_taken = {}
    for item in CLOTHING_ITEMS:
        new_taken[item["key"]] = st.number_input(
            f"{item['label']}の持ち帰り枚数", min_value=0, max_value=3, value=st.session_state.taken[item["key"]], key=f"taken_{item['key']}"
        )
    if st.button("持ち帰りを登録"):
        save_taken(new_taken)
        st.success("持ち帰りを登録しました")

st.markdown("---")
st.caption("© 2025 保育園着替え管理アプリ")


