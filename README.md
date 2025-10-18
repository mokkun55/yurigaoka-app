# Yurigaoka App Monorepo

このリポジトリは、百合丘アプリケーションのmonorepoです。生徒用アプリと教師用アプリを管理しています。

## 📋 目次

- [構成](#構成)
- [必要要件](#必要要件)
- [クイックスタート](#クイックスタート)
- [開発](#開発)
- [ドキュメント](#ドキュメント)

## 🏗 構成

- **apps/student**: 生徒用アプリケーション (Next.js + Firebase)
- **apps/teacher**: 教師用アプリケーション (Next.js + Supabase)
- **packages/functions**: Firebase Functions（両アプリで共有）
- **packages**: その他の共通パッケージ（将来的に拡張予定）

## ⚙️ 必要要件

- **Node.js**: v20.0.0以上
- **pnpm**: v9.0.0以上

### pnpmのインストール

```bash
npm install -g pnpm
```

## 🚀 クイックスタート

```bash
# 1. 依存関係のインストール
pnpm install

# 2. 環境変数の設定
# apps/student/.env.local と apps/teacher/.env.local を作成
# 詳細は SETUP.md を参照

# 3. 開発サーバー起動
pnpm dev
```

- 生徒用アプリ: http://localhost:3003
- 教師用アプリ: http://localhost:3004

## 💻 開発

### 基本コマンド

```bash
# 両方のアプリを同時に起動
pnpm dev
# または
make dev

# 生徒用アプリのみ起動
pnpm dev:student
# または
make dev-student

# 教師用アプリのみ起動
pnpm dev:teacher
# または
make dev-teacher
```

### ビルド

```bash
# 全アプリをビルド
pnpm build

# 個別にビルド
pnpm build:student
pnpm build:teacher
```

### Lint & Format

```bash
# Lint実行
pnpm lint

# Lint自動修正
pnpm lint:fix

# フォーマットチェック
pnpm format

# フォーマット自動修正
pnpm format:fix

# 型チェック
pnpm tsc
```

### メンテナンス

```bash
# node_modulesと.nextをクリーン
pnpm clean

# 完全クリーンして再インストール
pnpm clean:install

# 全てのコマンドを確認
make help
```

## 📚 ドキュメント

- **[SETUP.md](./SETUP.md)**: 詳細なセットアップ手順
- **[STRUCTURE.md](./STRUCTURE.md)**: プロジェクト構造の説明
- **[apps/student/README.md](./apps/student/README.md)**: 生徒用アプリの詳細
- **[apps/teacher/README.md](./apps/teacher/README.md)**: 教師用アプリの詳細

## 🛠 技術スタック

### 共通

- pnpm workspace
- TypeScript
- ESLint
- Prettier
- lefthook (Git hooks)

### 生徒用アプリ

- Next.js 15
- React 19
- Tailwind CSS
- Firebase (Auth, Firestore)
- React Hook Form + Zod

### 教師用アプリ

- Next.js 15
- React 19
- CSS Modules
- Supabase
- Mantine UI
- React Hook Form + Zod

## 📝 ライセンス

Private

## 👥 Contributors

- mokkun
