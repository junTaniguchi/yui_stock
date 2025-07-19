import streamlit as st
from utils import calc_needed, reset_all
from constants import CLOTHING_ITEMS

def page_check_needed():
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
