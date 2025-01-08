reset:
	pnpm reset
	pnpm install
	pnpm prepublishOnly
	cd ./dev && pnpm install

build:
	pnpm prepublishOnly

start:
	docker compose up