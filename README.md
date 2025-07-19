# 保育園着替え管理アプリ

## 概要

このアプリケーションは、保育園に預けるお子様の着替え（肌着、上着（半袖）、上着（長袖）、ズボン）の枚数を管理するためのStreamlit製Webアプリです。保育園には常に各種類の着替えが3枚ずつ揃っている必要があるという前提に基づき、毎日持ち帰った着替えの枚数を入力することで、翌日保育園に持っていくべき着替えの枚数を自動で計算・表示します。

## 機能

- **現在の保育園の着替え枚数表示**: 各種類の着替えが現在保育園に何枚あるかを表示します。
- **持ち帰り枚数入力**: その日に持ち帰った着替えの枚数を入力するフォームを提供します。
- **翌日持っていくべき枚数計算**: 入力された持ち帰り枚数に基づき、翌日保育園に持っていくべき着替えの枚数を計算し表示します。
- **リセット機能**: 保育園に持っていくべき着替えを補充した際に、保育園の在庫を初期状態（各3枚）にリセットする機能です。

## 使用技術

- [Streamlit](https://streamlit.io/): Python製のWebアプリケーションフレームワーク
- [Poetry](https://python-poetry.org/): Pythonの依存関係管理およびパッケージングツール

## セットアップ

### 前提条件

- Python 3.9以上
- Poetry (インストールされていない場合は、以下のコマンドでインストールできます)
  ```bash
  curl -sSL https://install.python-poetry.org | python3 -
  # もしくは pipx を使用する場合
  # python3 -m pip install --user pipx
  # ~/.local/bin/pipx install poetry
  ```

### インストール

1.  このリポジトリをクローンします。
    ```bash
    git clone <リポジトリのURL>
    cd yui_stock
    ```

2.  Poetryを使用して依存関係をインストールします。
    ```bash
    /Users/taniguchijun/.local/bin/poetry install
    ```

## アプリケーションの実行

以下のコマンドでStreamlitアプリケーションを起動します。

```bash
/Users/taniguchijun/.local/bin/poetry run streamlit run app.py
```

アプリケーションが起動すると、Webブラウザが自動的に開き、アプリが表示されます。iPhoneなどのモバイルデバイスからアクセスする場合は、同じネットワーク内のPCで起動し、表示されるURLにモバイルデバイスからアクセスしてください。

## 貢献

バグ報告や機能改善の提案は、GitHubのIssuesまたはPull Requestでお待ちしております。

## ライセンス

[MIT License](LICENSE) (もしライセンスファイルを作成する場合)
