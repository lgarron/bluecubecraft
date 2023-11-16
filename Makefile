.PHONY: dev
dev: setup
	bun run src/main.ts

.PHONY: setup
setup: node_modules

node_modules:
	bun install
