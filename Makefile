.PHONY: all install

all: $(shell find src -type f) node_modules
	npm run build

node_modules: package.json
	npm ci
	@ touch $@

install:
	mkdir -p $(INST_LUADIR)/dictionary/
	cp build/bundle.lua $(INST_LUADIR)/dictionary/bundle.lua
