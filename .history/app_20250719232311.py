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

def update_needed_tomorrow():
    """翌日持っていくべき枚数を更新する"""
    st.session_state.needed_tomorrow = {
        'undershirt': calculate_needed_tomorrow(st.session_state.current_stock['undershirt']),
        'short_sleeve': calculate_needed_tomorrow(st.session_state.current_stock['short_sleeve']),
        'long_sleeve': calculate_needed_tomorrow(st.session_state.current_stock['long_sleeve']),
        'pants': calculate_needed_tomorrow(st.session_state.current_stock['pants']),
    }

# --- UIコンポーネントの定義 ---
st.title("👕 保育園 着替え管理")
st.markdown("---")

# ユーザーIDの表示 (StreamlitではFirebaseのような認証は組み込まれていないため、ここでは仮の表示)
# 実際のFirestore連携では、認証後に取得したUIDを使用します
st.info(f"このアプリはセッションごとに状態を保持します。データを永続化するにはFirestoreなどのデータベース連携が必要です。")

# --- 現在の保育園の着替え ---
st.header("現在の保育園の着替え")
cols = st.columns(4)
clothing_items = [
    {'key': 'undershirt', 'label': '肌着'},
    {'key': 'short_sleeve', 'label': '上着(半袖)'},
    {'key': 'long_sleeve', 'label': '上着(長袖)'},
    {'key': 'pants', 'label': 'ズボン'},
]

for i, item in enumerate(clothing_items):
    with cols[i]:
        st.metric(
            label=item['label'],
            value=f"{st.session_state.current_stock[item['key']]} 枚",
            delta_color="off" # デルタ表示はオフ
        )
        if st.session_state.current_stock[item['key']] < 3:
            st.markdown(f"<p style='color:red; font-size:0.8em;'>不足</p>", unsafe_allow_html=True)
        else:
            st.markdown(f"<p style='color:green; font-size:0.8em;'>十分</p>", unsafe_allow_html=True)

st.markdown("---")

# --- 今日の持ち込み・持ち帰り ---
st.header("今日の持ち込み・持ち帰り")

for item in clothing_items:
    st.subheader(item['label'])
    col1, col2 = st.columns(2)
    with col1:
        st.session_state.input_brought[item['key']] = st.number_input(
            f"持っていく枚数 ({item['label']})",
            min_value=0,
            max_value=3,
            value=st.session_state.input_brought[item['key']],
            key=f"brought_{item['key']}"
        )
    with col2:
        st.session_state.input_taken[item['key']] = st.number_input(
            f"持ち帰る枚数 ({item['label']})",
            min_value=0,
            max_value=3,
            value=st.session_state.input_taken[item['key']],
            key=f"taken_{item['key']}"
        )

# --- 記録を保存ボタン ---
if st.button("今日の記録を保存", use_container_width=True):
    # 新しい在庫を計算
    new_stock = {}
    for item in clothing_items:
        key = item['key']
        current = st.session_state.current_stock[key]
        brought = st.session_state.input_brought[key]
        taken = st.session_state.input_taken[key]
        new_stock[key] = max(0, current + brought - taken) # 在庫は0以下にならないように

    st.session_state.current_stock = new_stock
    
    # 日次記録を保存 (ここではセッションステートに仮保存。Firestore連携の場合はここに書き込み処理)
    if 'daily_records' not in st.session_state:
        st.session_state.daily_records = []
    st.session_state.daily_records.append({
        'date': datetime.date.today().isoformat(),
        'brought': st.session_state.input_brought.copy(),
        'taken': st.session_state.input_taken.copy(),
        'stock_after_update': new_stock.copy()
    })

    # 入力フィールドをリセット
    st.session_state.input_brought = {k: 0 for k in st.session_state.input_brought}
    st.session_state.input_taken = {k: 0 for k in st.session_state.input_taken}

    st.success("今日の記録を保存しました！")
    st.experimental_rerun() # 画面を再描画して最新の状態を反映

st.markdown("---")

# --- 翌日持っていく枚数 ---
st.header("翌日持っていく枚数")
update_needed_tomorrow() # 常に最新の「翌日持っていく枚数」を計算

needed_cols = st.columns(4)
for i, item in enumerate(clothing_items):
    with needed_cols[i]:
        st.metric(
            label=item['label'],
            value=f"{st.session_state.needed_tomorrow[item['key']]} 枚",
            delta_color="off"
        )
        if st.session_state.needed_tomorrow[item['key']] > 0:
            st.markdown(f"<p style='color:orange; font-size:0.8em;'>持っていく必要あり</p>", unsafe_allow_html=True)
        else:
            st.markdown(f"<p style='color:gray; font-size:0.8em;'>必要なし</p>", unsafe_allow_html=True)

st.markdown("---")

# --- 在庫をリセットボタン ---
if st.button("在庫を初期値(各3枚)にリセット", use_container_width=True):
    st.session_state.current_stock = {
        'undershirt': 3,
        'short_sleeve': 3,
        'long_sleeve': 3,
        'pants': 3,
    }
    st.session_state.input_brought = {k: 0 for k in st.session_state.input_brought}
    st.session_state.input_taken = {k: 0 for k in st.session_state.input_taken}
    st.success("在庫を初期値にリセットしました。")
    st.experimental_rerun() # 画面を再描画して最新の状態を反映

# --- デバッグ情報 (オプション) ---
# st.sidebar.header("デバッグ情報")
# st.sidebar.json(st.session_state.current_stock)
# st.sidebar.json(st.session_state.daily_records if 'daily_records' in st.session_state else {})
