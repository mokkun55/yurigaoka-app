# @yurigaoka-app/common

学生アプリと教職員アプリで共有する型定義やユーティリティを提供するパッケージです。

## インストール

このパッケージは monorepo 内で workspace として管理されています。

```bash
# pnpm workspace を使用
pnpm install
```

## 使用方法

### 型定義のインポート

```typescript
import type { UserInfo, Absence, Home, AbsenceStatus } from '@yurigaoka-app/common'

// ユーザー情報
const user: UserInfo = {
  uid: 'user-123',
  name: '高専太郎',
  email: 'taro@example.com',
  role: 'student',
}

// 申請情報
const absence: Absence = {
  id: 1,
  user_id: 'user-123',
  type: 'homecoming',
  start_date: '2025-10-20',
  end_date: '2025-10-22',
  reason: '帰省',
  status: 'pending',
  created_at: '2025-10-18T10:00:00Z',
  updated_at: '2025-10-18T10:00:00Z',
}
```

## 提供する型定義

### ユーザー関連

- `UserInfo` - ユーザーの基本情報
- `StudentInfo` - 学生固有の情報
- `UserRole` - ユーザーの役割 (`'student' | 'teacher' | 'admin'`)
- `Grade` - 学年情報
- `Class` - クラス情報
- `Club` - 部活情報

### 申請関連

- `Absence` - 欠席・欠食届の情報
- `Home` - 帰省先情報
- `AbsenceStatus` - 申請ステータス (`'pending' | 'approved' | 'rejected' | 'canceled'`)
- `AbsenceType` - 申請タイプ (`'homecoming' | 'meal'`)
- `MealType` - 食事タイプ (`'breakfast' | 'lunch' | 'dinner' | null`)
- `MealInfo` - フォーム用の食事情報

## ビルド

```bash
# TypeScript のビルド
pnpm build

# ビルドを監視
pnpm build:watch

# ビルド成果物の削除
pnpm clean
```

## ディレクトリ構造

```
packages/common/
├── src/
│   ├── types/
│   │   ├── user.ts      # ユーザー関連の型定義
│   │   ├── absence.ts   # 申請関連の型定義
│   │   └── index.ts     # 型定義のエクスポート
│   └── index.ts         # パッケージのエントリーポイント
├── dist/                # ビルド成果物（自動生成）
├── package.json
├── tsconfig.json
└── README.md
```

## 開発ガイドライン

### 新しい型を追加する場合

1. `src/types/` 内に適切なファイルを作成または編集
2. `src/types/index.ts` でエクスポート
3. `pnpm build` でビルド
4. 使用するアプリで型をインポート

### 型定義のベストプラクティス

- データベースのスキーマと一致させる
- 必須フィールドとオプショナルフィールドを明確にする
- JSDoc コメントで説明を追加する
- Union型やEnum型を活用して型安全性を高める

## トラブルシューティング

### 型が見つからない場合

```bash
# パッケージを再ビルド
cd packages/common
pnpm build

# ルートで依存関係を再インストール
cd ../..
pnpm install
```

### TypeScriptエラーが出る場合

- `tsconfig.json` の設定を確認
- ビルド成果物 (`dist/`) が生成されているか確認
- IDE を再起動してみる
