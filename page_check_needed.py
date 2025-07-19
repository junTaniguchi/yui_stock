import streamlit as st
from firebase_client import db
from utils import calc_needed, reset_all
from constants import CLOTHING_ITEMS

def page_check_needed():
    st.title("翌日持っていくべき着替えの枚数")
    needed = calc_needed(st.session_state.stock)
    for item in CLOTHING_ITEMS:
        st.markdown(f"<div style='font-size:1.2em; font-weight:bold;'>{item['label']}</div>", unsafe_allow_html=True)
        st.markdown(f"<div style='font-size:2em; color:#333; margin-bottom:0.2em;'>{needed[item['key']]} 枚</div>", unsafe_allow_html=True)
        if needed[item["key"]] > 0:
            st.markdown("<span style='color:orange; font-size:1em;'>持っていく必要あり</span>", unsafe_allow_html=True)
        else:
            st.markdown("<span style='color:gray; font-size:1em;'>必要なし</span>", unsafe_allow_html=True)
        st.markdown("---")
    st.button("全てリセット", on_click=reset_all, use_container_width=True)
