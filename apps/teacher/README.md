# 百合丘アプリ - 教師用

教師用のアプリケーションです。

## 開発サーバー起動

```bash
# monorepoルートから
pnpm dev:teacher

# または、このディレクトリから
pnpm dev
```

開発サーバーは http://localhost:3004 で起動します。

## 主な機能

- ログイン
- 生徒管理
- 欠席・給食の確認
- レポート管理
- お知らせ管理
- コード管理
- 設定

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- CSS Modules
- Supabase (Authentication, Database)
- React Hook Form
- Zod (バリデーション)
- Mantine UI

## その他のコマンド

```bash
pnpm build           # ビルド
pnpm lint            # Lint実行
pnpm lint:fix        # Lint自動修正
pnpm format          # フォーマットチェック
pnpm format:fix      # フォーマット自動修正
pnpm tsc             # 型チェック
pnpm generate-type   # Supabase型定義生成
```
