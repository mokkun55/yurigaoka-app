# セットアップガイド

このドキュメントは、百合丘アプリのmonorepoのセットアップ方法を説明します。

## 前提条件

- **Node.js**: v20.0.0以上
- **pnpm**: v9.0.0以上

### pnpmのインストール

```bash
npm install -g pnpm
```

## 初回セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

これにより、ルートと全てのワークスペース（apps/student, apps/teacher）の依存関係がインストールされます。

### 2. 環境変数の設定

#### 生徒用アプリ (apps/student)

`apps/student/.env.local` を作成してください：

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
```

#### 教師用アプリ (apps/teacher)

`apps/teacher/.env.local` を作成してください：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 開発

### 両方のアプリを同時に起動

```bash
pnpm dev
# または
make dev
```

- 生徒用アプリ: http://localhost:3003
- 教師用アプリ: http://localhost:3004

### 個別にアプリを起動

```bash
# 生徒用アプリのみ
pnpm dev:student
# または
make dev-student

# 教師用アプリのみ
pnpm dev:teacher
# または
make dev-teacher
```

## ビルド

```bash
# 全アプリをビルド
pnpm build

# 個別にビルド
pnpm build:student
pnpm build:teacher
```

## Lint & Format

```bash
# Lint実行
pnpm lint

# Lint自動修正
pnpm lint:fix

# フォーマットチェック
pnpm format

# フォーマット自動修正
pnpm format:fix
```

## 型チェック

```bash
pnpm tsc
```

## その他のツール

### 生徒用アプリ - Firebase Emulator

```bash
# Emulatorを起動（既存データをインポート）
make student-emulators

# Emulatorをクリーンスタート
make student-emulators-clean

# シードデータを投入
make student-seed
```

### 生徒用アプリ - Storybook

```bash
make student-storybook
# または
cd apps/student && pnpm storybook
```

### 教師用アプリ - Supabase型定義生成

```bash
cd apps/teacher && pnpm generate-type
```

## ワークスペースの構造

```
monorepo/
├── apps/
│   ├── student/        # 生徒用アプリ (port 3003)
│   └── teacher/        # 教師用アプリ (port 3004)
├── packages/           # 共通パッケージ（将来的に使用）
├── pnpm-workspace.yaml # pnpmワークスペース設定
├── package.json        # ルートpackage.json
└── ...                 # 各種設定ファイル
```

## トラブルシューティング

### 依存関係のクリーンインストール

```bash
pnpm clean:install
# または
make clean-install
```

### pnpmのバージョンが古い場合

```bash
pnpm self-update
```

### ポートが既に使用されている

既定のポートが使用されている場合、各アプリの `package.json` の `dev` スクリプトでポート番号を変更できます。

## Git Hooks

lefthookを使用して、コミット前に自動的にLintとフォーマットが実行されます。

```bash
# lefthookのインストール（初回のみ）
pnpm exec lefthook install
```

## 便利なコマンド一覧

全てのコマンドは `make help` で確認できます：

```bash
make help
```

## 参考リンク

- [pnpm Workspace](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
