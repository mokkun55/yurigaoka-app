# Packages

このディレクトリには、アプリケーション間で共有される共通パッケージを配置します。

## 将来的な共通パッケージ例

- **@yurigaoka/shared-ui**: 共通UIコンポーネント
- **@yurigaoka/shared-utils**: 共通ユーティリティ関数
- **@yurigaoka/shared-types**: 共通型定義
- **@yurigaoka/firebase-config**: Firebase設定

## パッケージの作成方法

```bash
# 新しいパッケージディレクトリを作成
mkdir -p packages/shared-ui

# package.jsonを作成
cd packages/shared-ui
pnpm init
```

パッケージ名は `@yurigaoka/パッケージ名` の形式で命名することを推奨します。
