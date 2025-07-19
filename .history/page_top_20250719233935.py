import streamlit as st

def page_top():
    st.title("保育園 着替え管理アプリ")
    st.markdown("""
    ### できること
    - 翌日持っていくべき着替えの枚数を確認
    - 保育園にある着替えの枚数を登録
    - 持ち帰ってきた着替えを登録
    """)
    st.markdown("---")
    st.markdown("**下のボタンから各画面へ移動してください**")
    if st.button("翌日持っていくべき着替えの枚数", use_container_width=True):
        st.session_state.page = "check_needed"
    if st.button("保育園にある着替えの枚数を登録", use_container_width=True):
        st.session_state.page = "register_stock"
    if st.button("持ち帰ってきた着替えを登録", use_container_width=True):
        st.session_state.page = "register_taken"
