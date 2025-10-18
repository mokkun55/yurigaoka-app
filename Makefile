.PHONY: help install dev dev-student dev-teacher build lint format clean

help: ## ヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 依存関係をインストール
	pnpm install

dev: ## 両方のアプリを同時に起動
	pnpm dev

dev-student: ## 生徒用アプリを起動
	pnpm dev:student

dev-teacher: ## 教師用アプリを起動
	pnpm dev:teacher

build: ## 全アプリをビルド
	pnpm build

build-student: ## 生徒用アプリをビルド
	pnpm build:student

build-teacher: ## 教師用アプリをビルド
	pnpm build:teacher

lint: ## Lintを実行
	pnpm lint

lint-fix: ## Lintを自動修正
	pnpm lint:fix

format: ## フォーマットをチェック
	pnpm format

format-fix: ## フォーマットを自動修正
	pnpm format:fix

tsc: ## 型チェックを実行
	pnpm tsc

clean: ## node_modulesと.nextをクリーン
	pnpm clean

clean-install: ## 完全クリーンして再インストール
	pnpm clean:install

# Firebase
firebase-emulators: ## Firebase Emulatorsを起動
	firebase emulators:start --import=./apps/student/emulator-data --export-on-exit

firebase-emulators-clean: ## Firebase Emulatorsをクリーンスタート
	rm -rf ./apps/student/emulator-data
	firebase emulators:start --export-on-exit=./apps/student/emulator-data

firebase-deploy-functions: ## Firebase Functionsをデプロイ
	cd packages/functions && npm run build && cd ../.. && firebase deploy --only functions

firebase-deploy-firestore: ## Firestoreのルールとインデックスをデプロイ
	firebase deploy --only firestore

# Student app specific
student-seed: ## Student: シードデータを投入
	cd apps/student && pnpm seed:emulator

student-storybook: ## Student: Storybookを起動
	cd apps/student && pnpm storybook

