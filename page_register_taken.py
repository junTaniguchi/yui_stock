import streamlit as st
from firebase_client import db
from constants import CLOTHING_ITEMS

def page_register_taken():
    st.title("持ち帰ってきた着替えを登録")
    new_taken = {}
    for item in CLOTHING_ITEMS:
        st.markdown(f"<div style='font-size:1.2em; font-weight:bold;'>{item['label']}</div>", unsafe_allow_html=True)
        new_taken[item["key"]] = st.radio(
            f"{item['label']}の持ち帰り枚数",
            options=[0, 1, 2, 3],
            index=st.session_state.taken[item["key"]],
            key=f"taken_{item['key']}_radio",
            horizontal=False
        )
        st.markdown("---")
    if st.button("持ち帰りを登録", use_container_width=True):
        st.session_state.taken = new_taken.copy()
        # 持ち帰り分を在庫から減算
        for k in st.session_state.stock:
            st.session_state.stock[k] = max(0, st.session_state.stock[k] - st.session_state.taken[k])
        st.success("持ち帰りを登録しました")
