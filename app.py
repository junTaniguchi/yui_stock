import streamlit as st

st.set_page_config(layout="centered", page_title="保育園着替え管理アプリ")

st.title("保育園着替え管理アプリ")

# 着替えの種類
clothes_types = ["肌着", "上着(半袖)", "上着(長袖)", "ズボン"]

# 初期状態の設定（st.session_stateを使用）
if "daycare_stock" not in st.session_state:
    st.session_state.daycare_stock = {item: 3 for item in clothes_types}

st.header("現在の保育園の着替えの枚数")
for item, count in st.session_state.daycare_stock.items():
    st.write(f"- {item}: {count}枚")

st.header("持ち帰った着替えの枚数を入力")
returned_clothes = {}
for item in clothes_types:
    returned_clothes[item] = st.number_input(f"{item} 持ち帰った枚数 (0〜3枚)", min_value=0, max_value=3, value=0, key=f"returned_{item}")

if st.button("枚数を更新"):
    for item in clothes_types:
        st.session_state.daycare_stock[item] -= returned_clothes[item]
    st.success("枚数を更新しました！")
    st.experimental_rerun()

st.header("翌日持っていくべき枚数")
needed_to_bring = {}
for item in clothes_types:
    needed = 3 - st.session_state.daycare_stock[item]
    needed_to_bring[item] = max(0, needed) # 0未満にはならない
    st.write(f"- {item}: {needed_to_bring[item]}枚")

if st.button("保育園に持っていった（リセット）"):
    st.session_state.daycare_stock = {item: 3 for item in clothes_types}
    st.success("保育園の着替えをリセットしました！")
    st.experimental_rerun()

st.markdown("---")
st.markdown("このアプリは、保育園の着替えの枚数を管理し、翌日持っていくべき枚数を計算します。")
