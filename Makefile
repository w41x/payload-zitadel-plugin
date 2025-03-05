reset:
	pnpm reset
	pnpm install
	pnpm prepublishOnly
	cd ./dev && pnpm install

build:
	pnpm prepublishOnly

start:
	docker compose --profile development up

production-test:
	docker compose --profile production up