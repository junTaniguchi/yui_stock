import streamlit as st
from constants import CLOTHING_ITEMS

def page_register_stock():
    st.title("保育園にある着替えの枚数を登録")
    new_checked = {}
    for item in CLOTHING_ITEMS:
        st.markdown(f"""
<div style='background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:1.2em 1em 0.5em 1em;margin-bottom:1.2em;'>
  <div style='font-size:1.1em;font-weight:bold;margin-bottom:0.7em;text-align:center;'>{item['label']}</div>
  <div style='display:flex;justify-content:center;'>
    <div>
      {st.radio(
        label="",
        options=[0, 1, 2, 3],
        index=st.session_state.checked[item["key"]],
        key=f"checked_{item['key']}_radio",
        horizontal=True
      )}
    </div>
  </div>
</div>
""", unsafe_allow_html=True)
        # 値の取得はst.session_stateから
        new_checked[item["key"]] = st.session_state[f"checked_{item['key']}_radio"]
    if st.button("在庫を登録・更新", use_container_width=True):
        st.session_state.checked = new_checked.copy()
        st.session_state.stock = new_checked.copy()
        st.success("在庫を更新しました")
