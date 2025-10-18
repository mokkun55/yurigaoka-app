# Packages

このディレクトリには、アプリケーション間で共有される共通パッケージを配置します。

## 現在のパッケージ

### @monorepo/common

共通の型定義とユーティリティを提供するパッケージです。

- **場所**: `packages/common/`
- **使用アプリ**: student、teacher
- **提供する型**:
  - `UserInfo`: ユーザー基本情報
  - `StudentInfo`: 学生固有情報
  - `Absence`: 欠席・欠食届情報
  - `Home`: 帰省先情報
  - その他の共通型

詳細は [packages/common/README.md](./common/README.md) を参照してください。

### @monorepo/functions

Firebase Functions（student、teacher両方で使用）

- **場所**: `packages/functions/`
- **使用アプリ**: student、teacher

## 将来的な共通パッケージ例

- **@monorepo/shared-ui**: 共通UIコンポーネント
- **@monorepo/shared-utils**: 共通ユーティリティ関数
- **@monorepo/firebase-config**: Firebase設定

## パッケージの作成方法

```bash
# 新しいパッケージディレクトリを作成
mkdir -p packages/shared-ui

# package.jsonを作成
cd packages/shared-ui
pnpm init
```

### パッケージ命名規則

- パッケージ名は `@monorepo/パッケージ名` の形式で命名してください
- workspace設定により、アプリケーションから `workspace:*` として参照できます

### TypeScript設定

1. `tsconfig.json`を作成し、`tsconfig.base.json`を継承
2. 各アプリの`tsconfig.json`にパスマッピングを追加:

```json
{
  "compilerOptions": {
    "paths": {
      "@monorepo/パッケージ名": ["../../packages/パッケージ名/src/index.ts"]
    }
  }
}
```

### package.jsonの依存関係

アプリの`package.json`に追加:

```json
{
  "dependencies": {
    "@monorepo/パッケージ名": "workspace:*"
  }
}
```
