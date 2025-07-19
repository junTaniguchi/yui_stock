import streamlit as st
from constants import CLOTHING_ITEMS

def page_register_stock():
    st.title("保育園にある着替えの枚数を登録")
    new_checked = {}
    for item in CLOTHING_ITEMS:
        st.markdown(f"<div style='font-size:1.2em; font-weight:bold;'>{item['label']}</div>", unsafe_allow_html=True)
        new_checked[item["key"]] = st.radio(
            f"{item['label']}の在庫",
            options=[0, 1, 2, 3],
            index=st.session_state.checked[item["key"]],
            key=f"checked_{item['key']}_radio",
            horizontal=True
        )
        st.markdown("---")
    if st.button("在庫を登録・更新", use_container_width=True):
        st.session_state.checked = new_checked.copy()
        st.session_state.stock = new_checked.copy()
        st.success("在庫を更新しました")
