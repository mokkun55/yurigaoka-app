# プロジェクト構造

このドキュメントは、monorepoの構造とディレクトリの役割を説明します。

## ディレクトリツリー

```
monorepo/
├── .github/                    # GitHub設定
│   └── workflows/
│       └── ci.yml             # CI/CDワークフロー
│
├── .vscode/                   # VSCode設定
│   ├── settings.json          # エディタ設定
│   └── extensions.json        # 推奨拡張機能
│
├── apps/                      # アプリケーション
│   ├── student/              # 生徒用アプリ (Next.js + Firebase)
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router
│   │   │   ├── _components/  # 共通コンポーネント
│   │   │   │   └── ui/       # UIコンポーネント
│   │   │   ├── hooks/        # カスタムフック
│   │   │   ├── lib/          # ライブラリ設定
│   │   │   │   └── firebase/ # Firebase設定
│   │   │   └── utils/        # ユーティリティ関数
│   │   ├── functions/        # Firebase Cloud Functions
│   │   ├── public/           # 静的ファイル
│   │   ├── scripts/          # スクリプト
│   │   ├── firebase.json     # Firebase設定
│   │   ├── firestore.rules   # Firestore セキュリティルール
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   ├── eslint.config.mjs
│   │   ├── makefile          # Firebase Emulator用
│   │   └── README.md
│   │
│   └── teacher/              # 教師用アプリ (Next.js + Supabase)
│       ├── src/
│       │   ├── app/          # Next.js App Router
│       │   ├── ui/           # UIコンポーネント
│       │   ├── features/     # 機能別コード
│       │   ├── hooks/        # カスタムフック
│       │   ├── libs/         # ライブラリ設定
│       │   └── utils/        # ユーティリティ関数
│       │       └── supabase/ # Supabase設定
│       ├── public/           # 静的ファイル
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── eslint.config.mjs
│       └── README.md
│
├── packages/                  # 共通パッケージ（将来的に使用）
│   └── README.md             # パッケージ作成ガイド
│
├── node_modules/             # 依存関係（pnpmワークスペース）
│
├── .gitignore                # Git除外設定
├── .prettierrc.json          # Prettier設定
├── .prettierignore           # Prettier除外設定
├── .editorconfig             # エディタ設定
├── .npmrc                    # pnpm設定
├── cspell.json               # スペルチェック設定
├── lefthook.yml              # Git hooks設定
├── Makefile                  # 便利なコマンド集
├── package.json              # ルートpackage.json
├── pnpm-workspace.yaml       # pnpmワークスペース設定
├── pnpm-lock.yaml            # 依存関係ロックファイル
├── tsconfig.base.json        # 共通TypeScript設定
├── README.md                 # プロジェクト概要
├── SETUP.md                  # セットアップガイド
└── STRUCTURE.md              # このファイル
```

## 各ディレクトリの役割

### `/apps`

アプリケーションを配置するディレクトリです。各アプリは独立したNext.jsプロジェクトとして動作します。

#### `/apps/student` - 生徒用アプリ

- **技術スタック**: Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase
- **ポート**: 3003
- **主な機能**:
  - ログイン/ユーザー作成
  - お知らせ閲覧
  - 欠席届提出（欠席・給食）
  - 提出履歴確認
  - 設定

#### `/apps/teacher` - 教師用アプリ

- **技術スタック**: Next.js 15, React 19, TypeScript, CSS Modules, Supabase, Mantine UI
- **ポート**: 3004
- **主な機能**:
  - ログイン
  - 生徒管理
  - 欠席・給食の確認
  - レポート管理
  - お知らせ管理
  - コード管理
  - 設定

### `/packages`

将来的に共通パッケージを配置するディレクトリです。以下のような共通パッケージを作成することができます：

- `@yurigaoka/shared-ui`: 共通UIコンポーネント
- `@yurigaoka/shared-utils`: 共通ユーティリティ関数
- `@yurigaoka/shared-types`: 共通型定義
- `@yurigaoka/firebase-config`: Firebase設定

### ルートディレクトリの主要ファイル

| ファイル              | 説明                                                        |
| --------------------- | ----------------------------------------------------------- |
| `pnpm-workspace.yaml` | pnpmワークスペースの設定                                    |
| `package.json`        | ルートのpackage.json（共通スクリプトと共通devDependencies） |
| `tsconfig.base.json`  | 共通TypeScript設定（各アプリで拡張）                        |
| `.prettierrc.json`    | コードフォーマット設定                                      |
| `lefthook.yml`        | Git hooks設定（コミット前のLint/Format）                    |
| `Makefile`            | 便利なコマンド集                                            |
| `cspell.json`         | スペルチェック設定                                          |

## ワークスペース間の依存関係

### 現在の構成

現時点では、各アプリは独立しており、相互に依存していません。

### 将来的な構成例

共通パッケージを作成した場合、以下のように依存関係を設定できます：

```json
// apps/student/package.json
{
  "dependencies": {
    "@yurigaoka/shared-ui": "workspace:*",
    "@yurigaoka/shared-utils": "workspace:*"
  }
}
```

## 設定ファイルの継承

### TypeScript

各アプリの`tsconfig.json`は、将来的にルートの`tsconfig.base.json`を拡張できます：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // アプリ固有の設定
  }
}
```

### ESLint

各アプリは独自の`eslint.config.mjs`を持っていますが、必要に応じてルートに共通設定を作成して拡張できます。

### Prettier

`.prettierrc.json`はルートに1つだけ配置し、全てのワークスペースで共有されます。

## スクリプトの実行

### ルートから実行

```bash
# 全アプリに対して実行
pnpm dev                 # 全アプリを同時に起動
pnpm build               # 全アプリをビルド
pnpm lint                # 全アプリでLint実行

# 特定のアプリに対して実行
pnpm dev:student         # 生徒用アプリのみ起動
pnpm dev:teacher         # 教師用アプリのみ起動
pnpm build:student       # 生徒用アプリのみビルド
pnpm build:teacher       # 教師用アプリのみビルド
```

### アプリのディレクトリから実行

```bash
cd apps/student
pnpm dev                 # 生徒用アプリを起動
pnpm build               # 生徒用アプリをビルド
```

## 環境変数

環境変数は各アプリのルートに`.env.local`として配置します：

- `apps/student/.env.local` - 生徒用アプリの環境変数
- `apps/teacher/.env.local` - 教師用アプリの環境変数

これらのファイルは`.gitignore`に含まれており、Gitで管理されません。

## ベストプラクティス

### 1. 共通コードの抽出

複数のアプリで使用されるコードは、`packages/`ディレクトリに共通パッケージとして抽出することを検討してください。

### 2. 一貫性のある命名規則

- コンポーネント: PascalCase (`UserProfile.tsx`)
- ユーティリティ: camelCase (`formatDate.ts`)
- 定数: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### 3. パス解決

各アプリで絶対パス解決を設定すると、インポートが簡潔になります：

```typescript
// 相対パス（避ける）
import { Button } from '../../../_components/ui/button'

// 絶対パス（推奨）
import { Button } from '@/_components/ui/button'
```

### 4. 型安全性

- `strict: true`を維持
- `any`の使用を最小限に
- 共通の型定義は`packages/shared-types`に配置

## 参考資料

- [pnpm Workspace](https://pnpm.io/workspaces)
- [Monorepo のベストプラクティス](https://monorepo.tools/)
- [Next.js Documentation](https://nextjs.org/docs)
