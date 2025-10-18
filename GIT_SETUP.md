# Git セットアップガイド

このドキュメントは、monorepoでのGitセットアップ方法を説明します。

## 初回Gitセットアップ

### 1. Gitリポジトリの初期化

```bash
git init
```

### 2. Git Hooksのセットアップ

```bash
pnpm exec lefthook install
```

これにより、コミット前に自動的にLint、Format、型チェックが実行されます。

### 3. 初回コミット

```bash
# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "chore: initial commit - setup pnpm monorepo"
```

## Git設定の推奨事項

### グローバル設定

```bash
# ユーザー情報の設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# デフォルトブランチ名をmainに設定
git config --global init.defaultBranch main

# 改行コードの自動変換（Windows使用時）
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux
```

### リポジトリ固有の設定

```bash
# LFS (Large File Storage) の設定（必要な場合）
git lfs install
```

## ブランチ戦略

### 推奨ブランチ構成

```
main        # 本番環境用
  └─ develop     # 開発環境用
      └─ feature/* # 機能開発用
      └─ fix/*     # バグ修正用
```

### ブランチ作成例

```bash
# 開発ブランチの作成
git checkout -b develop

# 機能ブランチの作成
git checkout -b feature/add-login-page

# バグ修正ブランチの作成
git checkout -b fix/resolve-auth-issue
```

## コミットメッセージの規約

### Conventional Commits

以下の形式でコミットメッセージを書くことを推奨します：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（必須）

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマット等）
- `refactor`: バグ修正や機能追加を伴わないコードの変更
- `perf`: パフォーマンス向上のための変更
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

### Scope（任意）

- `student`: 生徒用アプリに関する変更
- `teacher`: 教師用アプリに関する変更
- `shared`: 共通パッケージに関する変更
- `deps`: 依存関係の更新
- `ci`: CI/CDの変更

### 例

```bash
# 生徒用アプリに新機能を追加
git commit -m "feat(student): add absence submission form"

# 教師用アプリのバグ修正
git commit -m "fix(teacher): resolve date picker rendering issue"

# ドキュメントの更新
git commit -m "docs: update setup guide"

# 依存関係の更新
git commit -m "chore(deps): update Next.js to v15.3.3"

# リファクタリング
git commit -m "refactor(shared): extract common date utilities"
```

## リモートリポジトリの設定

### GitHub

```bash
# リモートリポジトリの追加
git remote add origin https://github.com/username/yurigaoka-monorepo.git

# または SSH
git remote add origin git@github.com:username/yurigaoka-monorepo.git

# プッシュ
git push -u origin main
```

### GitHub Actionsの設定

`.github/workflows/ci.yml` が既に用意されているので、GitHubにプッシュすると自動的にCI/CDが実行されます。

## Gitフロー例

### 機能開発の流れ

```bash
# 1. 最新のdevelopブランチに移動
git checkout develop
git pull origin develop

# 2. 機能ブランチを作成
git checkout -b feature/new-feature

# 3. 開発とコミット
# （コミット時に自動的にlefthookが実行される）
git add .
git commit -m "feat(student): add new feature"

# 4. リモートにプッシュ
git push origin feature/new-feature

# 5. GitHub上でPull Requestを作成

# 6. レビュー後、developにマージ
```

## lefthookについて

### lefthookが実行する内容

コミット時（`pre-commit`フック）に以下が自動実行されます：

1. **ESLint**: コードの品質チェック
2. **Prettier**: コードフォーマット
3. **Spell Check**: スペルチェック
4. **TypeScript**: 型チェック

### lefthookの一時的な無効化

緊急時にのみ使用してください：

```bash
# 特定のコミットでhooksをスキップ
LEFTHOOK=0 git commit -m "emergency fix"
```

### lefthookの設定変更

設定は `lefthook.yml` で管理されています。

## .gitignoreについて

以下のファイル/ディレクトリは既に`.gitignore`に含まれています：

- `node_modules/`
- `.next/`
- `.env*.local`
- `*.log`
- `*.tsbuildinfo`
- その他ビルド成果物

## トラブルシューティング

### lefthookがインストールされない

```bash
# 手動でインストール
pnpm add -D lefthook
pnpm exec lefthook install
```

### コミット時にhooksが実行されない

```bash
# lefthookを再インストール
pnpm exec lefthook install
```

### Git hooks をリセット

```bash
# lefthookをアンインストール
pnpm exec lefthook uninstall

# 再インストール
pnpm exec lefthook install
```

## 参考リンク

- [Conventional Commits](https://www.conventionalcommits.org/)
- [lefthook](https://github.com/evilmartians/lefthook)
- [Git Best Practices](https://git-scm.com/book/en/v2)
