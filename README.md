# YUI Stock

## 概要

YUI Stockは、保育園に持っていく子供の衣類の在庫を管理し、補充が必要なものを把握するためのNext.jsアプリケーションです。

具体的には、以下のGoogleフォームに登録された持ち帰り衣類の情報をGoogleスプレッドシートで集計し、現在の在庫状況を算出・表示します。

- **Googleフォーム:** [https://docs.google.com/forms/d/1fFagw12r0Re5qn-2JE0Bw53y6MyOq7OH_2ErJM7xCw/edit](https://docs.google.com/forms/d/1fFagw12r0Re5qn-2JE0Bw53y6MyOq7OH_2ErJM7xCw/edit)
- **Googleスプレッドシート:** [https://docs.google.com/spreadsheets/d/12eB2vRaoegM0OKP4SmVEcUVFPZh5b1Dt2c0hX3hOn_U/edit?resourcekey=&gid=1996496700#gid=1996496700](https://docs.google.com/spreadsheets/d/12eB2vRaoegM0OKP4SmVEcUVFPZh5b1Dt2c0hX3hOn_U/edit?resourcekey=&gid=1996496700#gid=1996496700)

## 背景・目的

保育園では、毎日子供の衣類（肌着、上着、ズボンなど）の着替えが発生します。どの衣類を何枚補充すれば良いのかを正確に把握し、管理の手間を省くことを目的にこのアプリケーションは開発されました。

このアプリを使うことで、保護者は日々の持ち物管理を効率化し、衣類の不足を防ぐことができます。

## 主な機能

- Googleスプレッドシートから在庫データを取得するAPI (`/api/stock`)
- 取得した在庫データを表示するフロントエンド

## 技術スタック

- Next.js
- React
- TypeScript
- google-spreadsheet
- Tailwind CSS

## 起動方法

1. **環境変数の設定**

   プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の環境変数を設定してください。

   ```
   GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID
   GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=YOUR_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=YOUR_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **開発サーバーの起動**

   ```bash
   npm run dev
   ```

   ブラウザで[http://localhost:3000](http://localhost:3000)にアクセスすると、アプリケーションが表示されます。