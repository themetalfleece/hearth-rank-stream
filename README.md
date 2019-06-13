# hearth-rank-stream

## How to install the requirements/dependencies
* Clone this repo
* Download [node.js](https://nodejs.org/en/download/)
* Install [yarn](https://yarnpkg.com/lang/en/docs/install/)
* Install nodemon and ts-node with `yarn global add nodemon ts-node`
* Navigate to the `api` directory inside the repo with `cd api`
* Run `yarn` to install the dependencies
* Navigate to the `web-app` directory inside the repo with `cd web-app`
* Run `yarn` to install the dependencies

## How to build and run the server
* Navigate to the `api` directory with `cd api`
* For running in the development build, run `yarn dev`. It will automatically restart when you make changes
* For running in the production build, run `yarn build`, followed by `yarn start`. You can run both of them via `yarn prod`

## How to build and run the web app
* Navigate to the `web-app` directory with `cd web-app`
* Update the `src/utils/axios.ts` file to point to the server's address
* For running in the development build, run `yarn dev`. It will automatically restart when you make changes
* For the production build, run `yarn build`. This will generate the static files which need serving
* You can serve those files with any http server, like [serve](https://www.npmjs.com/package/serve)