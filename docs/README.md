# ゆいちゃんの保育園準備アプリ - ドキュメント

このディレクトリには、保育園準備アプリの詳細ドキュメントが含まれています。

## ドキュメント構成

### アーキテクチャ
- [プロジェクト概要](./architecture/overview.md) - アプリケーションの全体像と主要機能
- [技術スタック](./architecture/tech-stack.md) - 使用技術とその選択理由
- [データフロー](./architecture/data-flow.md) - データの流れと状態管理

### コンポーネント
- [認証システム](./components/authentication.md) - ログイン・認証機能
- [メイン機能](./components/main-features.md) - 在庫管理・記録機能
- [UI/UX](./components/ui-ux.md) - ユーザーインターフェース設計

### データ設計
- [データモデル](./data/models.md) - Firestore データ構造
- [アイテム設定](./data/items-config.md) - マスターデータ設計
- [型定義](./data/type-definitions.md) - TypeScript型システム

### PWA機能
- [PWA実装](./pwa/implementation.md) - Progressive Web App機能
- [オフライン対応](./pwa/offline.md) - オフライン機能とキャッシュ戦略

### 開発・運用
- [開発環境構築](./development/setup.md) - 開発環境のセットアップ
- [デプロイ](./development/deployment.md) - Firebase Hostingへのデプロイ
- [テスト戦略](./development/testing.md) - テスト方針と実装