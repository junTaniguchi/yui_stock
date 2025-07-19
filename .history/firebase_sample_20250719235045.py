import firebase_admin
from firebase_admin import credentials, firestore

# サービスアカウントキーのパス
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# データの書き込み例
db.collection("stocks").document("user1").set({
    "hadagi": 3,
    "jacket_short": 2,
    "jacket_long": 1,
    "pants": 3
})

# データの読み込み例
doc = db.collection("stocks").document("user1").get()
if doc.exists:
    print(doc.to_dict())