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

# Student app specific
student-emulators: ## Student: エミュレーターを起動
	cd apps/student && make emulators

student-emulators-clean: ## Student: エミュレーターをクリーンスタート
	cd apps/student && make emulators-clean

student-seed: ## Student: シードデータを投入
	cd apps/student && make seed

student-storybook: ## Student: Storybookを起動
	cd apps/student && make story

