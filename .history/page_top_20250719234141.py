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
    st.markdown("**左上のメニュー（≡）から各画面へ移動してください**")
