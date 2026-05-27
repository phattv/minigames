BUN ?= $(shell which bun)

.DEFAULT_GOAL := dev

.PHONY: dev prod install clean-node

dev:
	$(BUN) run dev

prod:
	$(BUN) run build && $(BUN) run start

install:
	$(BUN) install

clean-node:
	find . -type f \( -name "bun.lockb" -o -name "bun.lock" -o -name "yarn.lock" -o -name "package-lock.json" \) -exec rm -f {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	@echo "🧽 Cleaned all lock files and node_modules."