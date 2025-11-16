# 🌸 ゆいちゃんの保育園準備アプリ

保育園の持ち物管理を効率化するPWAアプリです。

## 📱 機能

### 📊 日常管理
- **朝の在庫確認**: 保育園にある着替えの在庫数をチェック
- **夕方の記録**: その日使った着替えの枚数を記録
- **翌日の準備**: 必要な持参枚数を自動計算
- **チェック機能**: カバンに入れたアイテムをチェックして進捗管理

### 📅 週単位アイテム管理
- **インテリジェントな状態管理**: 実際の持参・持ち帰り状況を追跡
- **水着・ジャンパー管理**: 
  - 家にある状態 → 任意の平日に持参を提案
  - 保育園にある状態 → 金曜日に持ち帰りを提案
- **敷布団カバー・枕用タオル管理**: 
  - 金曜日に新品持参＆使用済み持ち帰りを提案
- **祝日・欠席対応**: 
  - 月曜日に水着・ジャンパーを持参しなかった場合、火曜日以降も表示
  - 実際の利用状況に応じた柔軟な管理

### 🎨 UI/UX
- **専用アイコン**: 各アイテムに分かりやすいアイコン表示
- **プログレスバー**: 準備完了度を視覚的に表示
- **Google認証**: 安全なログインシステム
- **PWA対応**: スマートフォンにアプリとしてインストール可能

## 🚀 セットアップ

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Authentication > Sign-in method で Google を有効化
4. Firestore Database を作成（テストモードでOK）

### 2. Firebase設定の更新

`src/firebase.ts` ファイルの設定を更新：

```typescript
const firebaseConfig = {
  apiKey: "あなたのAPIキー",
  authDomain: "あなたのプロジェクト.firebaseapp.com",
  projectId: "あなたのプロジェクトID",
  storageBucket: "あなたのプロジェクト.appspot.com",
  messagingSenderId: "123456789",
  appId: "あなたのアプリID"
};
```

設定は Firebase Console > プロジェクトの設定 > マイアプリ から取得できます。

### 3. 開発サーバーの起動

```bash
npm install
npm start
```

### 4. ビルドとデプロイ

#### Firebase Hostingへのデプロイ（無料）

1. **Firebase CLIをインストール**
```bash
npm install -g firebase-tools
```

2. **アプリをビルド**
```bash
npm run build
```

3. **Firebase Console で Web Hosting を有効化**
   - [Firebase Console](https://console.firebase.google.com/) にアクセス
   - プロジェクトを選択
   - 左サイドバー → 「すべてのプロダクト」→ **「Hosting」** を選択
   - **「始める」** をクリック（**App Hosting ではなく Web Hosting** を選択）

4. **ターミナルでデプロイ**
```bash
firebase login
firebase deploy
```

5. **スマホでアプリとして利用**
   - デプロイ完了後に表示されるURL（例：`https://yui-stock.web.app`）をスマホで開く
   - ブラウザのメニューから **「ホーム画面に追加」** を選択
   - アプリアイコンとしてホーム画面に追加され、ネイティブアプリのように利用可能

#### 無料枠の制限
- **ストレージ**: 10GB
- **月間転送量**: 360MB
- **カスタムドメイン**: 対応
- **SSL証明書**: 自動

#### 代替デプロイ先
Firebase Hostingが利用できない場合：
- **Vercel**: `npm install -g vercel` → `vercel`
- **Netlify**: GitHubリポジトリと連携して自動デプロイ
- **GitHub Pages**: 静的サイトホスティング

## 📱 使い方

### 日常的な使用方法
1. **ログイン**: Googleアカウントでログイン
2. **朝の確認**: 保育園到着時に在庫をチェック + 週単位アイテムの持参記録
3. **夕方の記録**: お迎え時に使用枚数を記録 + 週単位アイテムの持ち帰り記録
4. **翌日の準備**: 自動計算された必要枚数とチェックリストを確認

### インテリジェントなリマインダー
- **実データベース**: フォームで記録した実際の持参・持ち帰り状況を基に判断
- **柔軟な管理**: 
  - 水着・ジャンパーを月曜日に持参しなかった → 火曜日以降の平日にも表示
  - 金曜日に布団カバーを交換しなかった → その週は持参済みとして扱わない
- **週単位の追跡**: 同じ週に複数回同じアイテムを提案しない賢い制御

### チェック機能の使い方
- **準備画面**: アイテムをタップしてチェック/チェック解除
- **進捗表示**: 「カバンに入れた: 3/5」で完了度を可視化
- **状態保存**: チェック状態は翌日まで自動保存

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **認証**: Firebase Authentication (Google)
- **データベース**: Firebase Firestore
- **PWA**: Service Worker + Web App Manifest
- **デザイン**: CSS3 (カスタムスタイル)

## 📂 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Login.tsx       # ログイン画面（Googleログイン）
│   ├── Dashboard.tsx   # メインダッシュボード（週単位状態管理）
│   ├── MorningCheck.tsx # 朝の在庫確認（週単位アイテム持参記録）
│   ├── EveningCheck.tsx # 夕方の記録（週単位アイテム持ち帰り記録）
│   ├── TomorrowNeeds.tsx # 翌日の必要アイテム（チェック機能付き）
│   ├── WeeklyItems.tsx  # 週単位アイテム表示（チェック機能付き）
│   ├── Layout.tsx      # 共通レイアウト
│   ├── *.css          # コンポーネントスタイル
│   └── Forms.css      # フォーム共通スタイル
├── contexts/           # Reactコンテキスト
│   └── AuthContext.tsx # 認証コンテキスト
├── config/             # 設定ファイル
│   └── items.ts        # アイテム定義（アイコン・スケジュール）
├── types/              # TypeScript型定義
│   └── index.ts        # 全型定義（週単位状態管理含む）
├── firebase.ts         # Firebase設定
├── firebase.json       # Firebase Hosting設定
└── .firebaserc         # Firebaseプロジェクト設定
```

## 🎨 デザインのこだわり

- 可愛らしいパステルカラー
- 直感的なアイコンとイラスト
- スマートフォンファーストのレスポンシブデザイン
- アニメーション効果で楽しい操作感

## 📊 データモデル

### StockCheck（在庫確認・使用記録）
```typescript
{
  date: string,                    // YYYY-MM-DD
  type: 'morning' | 'evening',     // 朝の確認 | 夕方の記録
  items: Record<string, number>,   // 日常アイテム: itemId -> count
  weeklyItems?: Record<string, boolean>, // 週単位アイテム: itemId -> brought/taken
  userId: string,
  timestamp: Date
}
```

### WeeklyItemStatus（週単位アイテム状態）
```typescript
{
  itemId: string,
  lastBroughtDate?: string,        // 最後に持参した日付
  lastTakenDate?: string,          // 最後に持ち帰った日付
  currentStatus: 'at_home' | 'at_nursery' // 現在の場所
}
```

### ClothingItem（アイテム定義）
```typescript
{
  id: string,
  name: string,
  type: string,
  required: number,                // 必要在庫数
  schedule?: 'daily' | 'weekly_monday' | 'weekly_friday',
  icon: string                     // 表示アイコン（絵文字）
}
```

## 🔒 セキュリティ

- Firebase Rules により個人データを保護
- Google認証による安全なログイン
- HTTPSでの通信

## 📝 ライセンス

MIT License

## 🚀 主要な技術的特徴

### インテリジェントな状態管理
- 週単位アイテムの現在地（家 or 保育園）を正確に追跡
- 過去2週間のデータを分析して最適なリマインダーを生成
- 祝日・欠席による不規則なスケジュールに自動対応

### ユーザビリティ重視の設計
- ワンタップでのチェック機能
- プログレスバーによる視覚的な進捗表示
- アイテムごとの専用アイコンで直感的な操作

### PWA対応
- オフライン機能
- ホーム画面追加でネイティブアプリのような体験
- レスポンシブデザイン

## 🔄 今後の拡張予定

- [ ] 通知機能（翌朝のリマインダー）
- [ ] 統計機能（月別の使用量分析）
- [ ] 複数の子ども対応
- [ ] カスタマイズ可能なアイテム管理

## 👪 作成者

共働き家庭の保育園準備を効率化するために作成されました。実際の保育園生活の経験を基に、本当に必要な機能だけを厳選して実装しています。
