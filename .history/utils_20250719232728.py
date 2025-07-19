def calc_needed(stock):
    return {k: max(0, 3 - v) for k, v in stock.items()}

def reset_all():
    from constants import CLOTHING_ITEMS
    import streamlit as st
    st.session_state.stock = {item["key"]: 3 for item in CLOTHING_ITEMS}
    st.session_state.taken = {item["key"]: 0 for item in CLOTHING_ITEMS}
    st.session_state.checked = {item["key"]: 3 for item in CLOTHING_ITEMS}
