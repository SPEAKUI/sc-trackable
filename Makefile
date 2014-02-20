build:
	@npm install
	@make test

clean:
	@rm -rf node_modules

docs:
	@./node_modules/.bin/mocha test/docs.test.js -R markdown > README.md

prepublish:
	@make clean
	@make build
	@make docs

test:
	@npm test

watch:
	@./node_modules/.bin/mocha -w -R min

.PHONY: build clean docs prepublish test watch