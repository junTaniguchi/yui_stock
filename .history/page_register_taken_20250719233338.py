import streamlit as st
from constants import CLOTHING_ITEMS

def page_register_taken():
    st.title("持ち帰ってきた着替えを登録")
    new_taken = {}
    for item in CLOTHING_ITEMS:
        st.markdown(f"""
<div style='background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:1.2em 1em 0.5em 1em;margin-bottom:1.2em;'>
  <div style='font-size:1.1em;font-weight:bold;margin-bottom:0.7em;text-align:center;'>{item['label']}</div>
  <div style='display:flex;justify-content:center;'>
    <div>
      {st.radio(
        label="",
        options=[0, 1, 2, 3],
        index=st.session_state.taken[item["key"]],
        key=f"taken_{item['key']}_radio",
        horizontal=True
      )}
    </div>
  </div>
</div>
""", unsafe_allow_html=True)
        new_taken[item["key"]] = st.session_state[f"taken_{item['key']}_radio"]
    if st.button("持ち帰りを登録", use_container_width=True):
        st.session_state.taken = new_taken.copy()
        # 持ち帰り分を在庫から減算
        for k in st.session_state.stock:
            st.session_state.stock[k] = max(0, st.session_state.stock[k] - st.session_state.taken[k])
        st.success("持ち帰りを登録しました")
