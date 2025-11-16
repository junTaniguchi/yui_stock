# メイン機能 - 在庫管理・記録機能

## ダッシュボード (Dashboard.tsx)

### 概要
アプリケーションのメインコントローラーとして、全体の状態管理と画面遷移を担当します。

### 主要機能

#### 1. 日常管理フロー
```typescript
朝の在庫確認 → 夕方の記録 → 翌日の準備計算
```

#### 2. データ管理
- **Firestoreデータ取得**: `loadTodayData()`
- **在庫計算**: `calculateTomorrowNeeds()`
- **保育園在庫計算**: `calculateNurseryStocks()`
- **週単位状態管理**: `loadWeeklyItemStatuses()`

#### 3. 重要な計算ロジック

##### グループアイテム（上着）の必要数計算
```typescript
const nurseryStock = Math.max(0, totalMorningStock - totalTakenHomeToday);
const needToBring = Math.max(0, 3 - nurseryStock);
```

##### 一般アイテム（肌着・ズボン）の必要数計算
```typescript
needToBring = Math.max(0, 3 - nurseryStock);
```

##### 毎日持ち帰りアイテム（連絡帳等）
```typescript
needToBring = 1;
```

### 依存関係
- `AuthContext`: ユーザー認証状態
- `config/items.ts`: アイテム設定
- `types/index.ts`: 型定義
- 各種子コンポーネント

## 朝の在庫確認 (MorningCheck.tsx)

### 概要
保育園にある着替えの枚数をチェック・記録するフォームコンポーネントです。

### 主要機能

#### 1. 入力制限
- **数値制限**: タオル・連絡帳・ストローマグ・ビニール袋は0-1のみ
- **バリデーション**: `handleCountChange()`でリアルタイム検証

#### 2. データ操作
- **新規作成**: 初回入力時のFirestore保存
- **更新**: 既存データの修正対応
- **週単位アイテム**: 持参チェック機能

#### 3. 実装詳細
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Firestoreへのデータ保存/更新
  // type: 'morning'として記録
};
```

### UI特徴
- 直感的な数値入力
- 週単位アイテムのチェックボックス
- リアルタイムバリデーション

## 夕方の記録 (EveningCheck.tsx)

### 概要
今日使用した着替えの枚数を記録するフォームコンポーネントです。

### 主要機能

#### 1. 使用記録
- MorningCheckと同様の入力制限
- 週単位アイテムの持ち帰りチェック
- 使用枚数の正確な記録

#### 2. データ構造
```typescript
// type: 'evening'として保存
{
  date: string,
  type: 'evening',
  items: Record<string, number>,
  weeklyItems: Record<string, boolean>,
  userId: string,
  timestamp: Date
}
```

### 計算への影響
Dashboard.tsxの計算ロジックで翌日の必要数算出に使用されます。

## 翌日の準備物 (TomorrowNeeds.tsx)

### 概要
計算された翌日必要物品の表示とチェックリスト機能を提供します。

### 主要機能

#### 1. 進捗管理
- **プログレスバー**: 準備完了度の視覚化
- **チェック機能**: 各アイテムの準備状況
- **ローカルストレージ**: チェック状態の永続化

#### 2. インタラクション
```typescript
const handleCheck = (itemId: string) => {
  // チェック状態の切り替え
  // ローカルストレージへの保存
};

const handleInteraction = (itemId: string) => {
  // マウス・タッチイベント統合処理
};
```

#### 3. データ型
```typescript
interface DailyNeed {
  itemId: string;
  itemName: string;
  needToBring: number;
  icon: string;
  unit: string;
  isChecked?: boolean;
}
```

### UX特徴
- タッチ操作対応
- 進捗バーによる視覚的フィードバック
- 状態保持機能

## 週単位アイテム (WeeklyItems.tsx)

### 概要
水着やジャンパー、布団カバー等の週単位準備物の表示とスケジュール管理を行います。

### 主要機能

#### 1. スケジュール表示
- **曜日別アクション**: 持参/持ち帰りの明確な指示
- **状態追跡**: 過去2週間データから現在位置推定
- **柔軟なリマインダー**: 実際の記録に基づく調整

#### 2. UI機能
```typescript
const getDayText = (day: number) => {
  // 曜日の日本語変換
};

const getActionIcon = (action: string) => {
  // アクション別アイコン表示
};
```

#### 3. データ型
```typescript
interface WeeklyNeed {
  itemId: string;
  itemName: string;
  action: 'bring' | 'take_home';
  icon: string;
  dayOfWeek: number;
  isChecked?: boolean;
}
```

### 管理の特徴
- 週単位での状態管理
- 曜日別アクション指示
- チェック機能による確認
- 過去データとの整合性チェック

## 保育園在庫表示 (NurseryStockView.tsx)

### 概要
現在保育園にある在庫状況をリアルタイムで表示します。

### 表示内容
- 各アイテムの現在在庫数
- 必要在庫数との比較
- 不足状況のハイライト
- グループアイテムの合計表示

### 計算ベース
Dashboard.tsxの`calculateNurseryStocks()`結果を使用し、最新の在庫状況を提供します。
