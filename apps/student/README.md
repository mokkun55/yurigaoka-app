# 百合丘アプリ - 生徒用

生徒用のアプリケーションです。

## 開発サーバー起動

```bash
# monorepoルートから
pnpm dev:student

# または、このディレクトリから
pnpm dev
```

開発サーバーは http://localhost:3003 で起動します。

## 主な機能

- ログイン/ユーザー作成
- お知らせ閲覧
- 欠席届提出（欠席・給食）
- 提出履歴確認
- 設定

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore)
- React Hook Form
- Zod (バリデーション)

## その他のコマンド

```bash
pnpm build        # ビルド
pnpm lint         # Lint実行
pnpm lint:fix     # Lint自動修正
pnpm format       # フォーマットチェック
pnpm format:fix   # フォーマット自動修正
pnpm tsc          # 型チェック
pnpm storybook    # Storybook起動
```

## Firebase Emulator

```bash
pnpm seed:emulator  # エミュレータにテストデータをシード
```
