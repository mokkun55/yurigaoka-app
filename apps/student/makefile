story:
	pnpm storybook

dev:
	pnpm dev

# エミュレーターを起動（既存データがあればインポート、終了時にエクスポート）
emulators:
	firebase emulators:start --import=./emulator-data --export-on-exit

# エミュレーターをクリーンスタート（既存データを破棄）
emulators-clean:
	rm -rf ./emulator-data
	firebase emulators:start --export-on-exit=./emulator-data

# シードデータを投入（エミュレーターが起動している状態で実行）
seed:
	pnpm seed:emulator

# Functionsをビルド
build-functions:
	cd ../../packages/functions && npm run build

# Functionsをデプロイ
deploy-functions:
	firebase deploy --only functions