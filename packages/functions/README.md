# Firebase Functions

このパッケージには、studentアプリとteacherアプリの両方で使用される共有のFirebase Functionsが含まれています。

## 概要

- **場所**: `packages/functions/`
- **使用アプリ**: student, teacher
- **主な機能**: ユーザー作成時の自動処理、認証関連のトリガー

## 開発

### ビルド

```bash
cd packages/functions
npm run build
```

### ビルド（ウォッチモード）

```bash
npm run build:watch
```

### ローカルでのテスト

Firebase Emulatorを使用してローカルでテストできます。各アプリ（student または teacher）のディレクトリから実行してください。

```bash
# studentアプリから
cd apps/student
firebase emulators:start

# teacherアプリから
cd apps/teacher
firebase emulators:start
```

## デプロイ

各アプリのディレクトリから、以下のコマンドでデプロイできます：

```bash
cd apps/student
firebase deploy --only functions

# または
cd apps/teacher
firebase deploy --only functions
```

## 構成

### 主な関数

#### `createUserDocument`

新しいユーザーが作成されたときに自動的にFirestoreにユーザードキュメントを作成します。

- **トリガー**: Authentication onCreate
- **リージョン**: asia-northeast1 (東京)
- **機能**:
  - メールアドレスに基づいてユーザーロールを判定（student, teacher, manager）
  - 学生メールパターン: `gXXXXX@ktc.ac.jp`
  - teacherWhitelistコレクションをチェック
  - 適切なユーザードキュメントをFirestoreに作成

## 技術スタック

- Firebase Functions v2
- Firebase Admin SDK
- TypeScript
- Node.js 20

## 注意事項

- このパッケージは monorepo の共有リソースです
- student と teacher の両方のアプリから参照されます
- 変更は両方のアプリに影響する可能性があるため、慎重に行ってください
