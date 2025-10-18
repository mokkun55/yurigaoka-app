# コマンドチートシート

よく使うコマンドをまとめたクイックリファレンスです。

## 📦 セットアップ

```bash
# 依存関係のインストール
pnpm install

# Git hooksのセットアップ
pnpm exec lefthook install

# 環境変数のコピー（テンプレートがある場合）
cp apps/student/.env.example apps/student/.env.local
cp apps/teacher/.env.example apps/teacher/.env.local
```

## 🚀 開発

### 開発サーバー

```bash
# 全アプリを同時に起動
pnpm dev

# 生徒用アプリのみ
pnpm dev:student

# 教師用アプリのみ
pnpm dev:teacher
```

### Makefileを使用（より短いコマンド）

```bash
make dev              # 全アプリ起動
make dev-student      # 生徒用アプリ起動
make dev-teacher      # 教師用アプリ起動
```

## 🏗 ビルド

```bash
# 全アプリをビルド
pnpm build

# 個別にビルド
pnpm build:student
pnpm build:teacher

# または
make build
make build-student
make build-teacher
```

## 🧹 Lint & Format

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

### Makefileを使用

```bash
make lint
make lint-fix
make format
make format-fix
make tsc
```

## 🧪 テスト

```bash
# 生徒用アプリのテスト（追加時）
cd apps/student && pnpm test

# 教師用アプリのテスト（追加時）
cd apps/teacher && pnpm test
```

## 🔧 メンテナンス

```bash
# node_modulesと.nextをクリーン
pnpm clean

# 完全クリーンして再インストール
pnpm clean:install

# または
make clean
make clean-install
```

## 📦 依存関係の管理

### 追加

```bash
# ルートに追加（全ワークスペースで共有）
pnpm add -Dw prettier

# 特定のアプリに追加
pnpm --filter student add axios
pnpm --filter teacher add axios

# または、アプリのディレクトリで
cd apps/student && pnpm add axios
```

### 削除

```bash
# 特定のアプリから削除
pnpm --filter student remove axios

# または、アプリのディレクトリで
cd apps/student && pnpm remove axios
```

### 更新

```bash
# 全依存関係を最新に更新
pnpm up -r

# 特定のパッケージを更新
pnpm up -r next

# インタラクティブに更新
pnpm up -r -i
```

## 🎨 生徒用アプリ特有のコマンド

### Storybook

```bash
cd apps/student && pnpm storybook

# または
make student-storybook
```

### Firebase Emulator

```bash
# エミュレーターを起動（monorepoルートから）
make firebase-emulators

# エミュレーターをクリーンスタート（既存データを破棄）
make firebase-emulators-clean

# シードデータを投入（エミュレーターが起動している状態で実行）
make student-seed

# または直接firebase CLIを使用
firebase emulators:start --import=./apps/student/emulator-data --export-on-exit
```

### Firebase Functions

```bash
# Functionsをビルド
cd packages/functions
npm run build

# Functionsをデプロイ（monorepoルートから）
cd ../..
make firebase-deploy-functions

# または直接firebase CLIを使用
firebase deploy --only functions

# Firestoreのルールとインデックスをデプロイ
make firebase-deploy-firestore
# または
firebase deploy --only firestore
```

## 🎯 教師用アプリ特有のコマンド

### Supabase型定義生成

```bash
cd apps/teacher && pnpm generate-type
```

## 🔍 便利なコマンド

### 全体の統計情報

```bash
# 全パッケージのリスト表示
pnpm list -r --depth 0

# 特定のパッケージがどこで使われているか
pnpm why react

# アウトデートなパッケージを確認
pnpm outdated -r
```

### ログ確認

```bash
# 生徒用アプリのログ（開発時）
cd apps/student && tail -f firebase-debug.log

# 教師用アプリのログ（本番環境）
cd apps/teacher && vercel logs
```

## 🐛 トラブルシューティング

### キャッシュクリア

```bash
# Next.jsキャッシュをクリア
rm -rf apps/student/.next
rm -rf apps/teacher/.next

# pnpmキャッシュをクリア
pnpm store prune

# 全てクリーンアップ
pnpm clean:install
```

### ポート競合

```bash
# ポートを使用しているプロセスを確認
lsof -i :3003  # 生徒用アプリのポート
lsof -i :3004  # 教師用アプリのポート

# プロセスを終了
kill -9 <PID>
```

### Git hooks の問題

```bash
# lefthookを再インストール
pnpm exec lefthook uninstall
pnpm exec lefthook install

# Git hooksを確認
ls -la .git/hooks/
```

## 📊 パフォーマンス

### ビルド時間の確認

```bash
# Next.jsのビルド統計を表示
cd apps/student && ANALYZE=true pnpm build
cd apps/teacher && ANALYZE=true pnpm build
```

### バンドルサイズの分析

```bash
# @next/bundle-analyzerを追加後
cd apps/student && pnpm add -D @next/bundle-analyzer
```

## 🔒 セキュリティ

```bash
# 脆弱性のチェック
pnpm audit

# 自動修正可能な脆弱性を修正
pnpm audit --fix
```

## 📝 ドキュメント生成

```bash
# TypeDoc（追加時）
pnpm add -Dw typedoc
pnpm exec typedoc
```

## 🎁 その他の便利なコマンド

```bash
# 全てのMakeコマンドを表示
make help

# pnpmのバージョンを確認
pnpm -v

# Node.jsのバージョンを確認
node -v

# 環境変数を確認（開発時）
cd apps/student && cat .env.local
cd apps/teacher && cat .env.local
```

## 🔗 ショートカット（エイリアス推奨）

`.bashrc`または`.zshrc`に以下を追加すると便利です：

```bash
# monorepoのルートに移動
alias cdm="cd /Users/mokkun/MyCode/sotuken/monorepo"

# よく使うコマンドのエイリアス
alias pdev="pnpm dev"
alias pbuild="pnpm build"
alias plint="pnpm lint:fix"
alias pformat="pnpm format:fix"
```

## 📚 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [SETUP.md](./SETUP.md) - セットアップガイド
- [STRUCTURE.md](./STRUCTURE.md) - プロジェクト構造
- [GIT_SETUP.md](./GIT_SETUP.md) - Git セットアップ
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - 移行サマリー
