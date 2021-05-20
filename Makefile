install:
	npm i && cd app && npm i && cd ..

clean:
	rm -rf node_modules
	rm -rf app/node_modules
	rm -rf app/dist
	rm -rf build

test:
	npm run test

compile:
	npm run compile

serve:
	npm run serve