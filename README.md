# hiking-app

## Getting started

Clone the repo and run the following commands

Install dependencies

```sh
  npm i
```

```sh
  npm run start:dev
```

You should now have the server running on localhost:3000. When you change source code, webpack should rebuild and nodemon will run the new code without needing to restart the server.

## DOTENV

You will need to create a new `.env` file with your token from hiking project. See `env.sample`.

## Linting

Linting mistakes are corrected when you commit using a githook or by running

```sh
  npm run lint:fix
```

## Deploying

Simply open a pr and when it is merged the CD pipeline will deploy the change
