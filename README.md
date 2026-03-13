# Demo App

An Angular application for browsing and filtering job descriptions by month.

## Requirements

- [Node.js](https://nodejs.org/) v22+
- [Docker](https://www.docker.com/) (optional, for containerized runs)

## Project structure

```
frontend-coding-assignment/
└── demo-app/        ← all commands below are run from this directory
    ├── src/
    ├── package.json
    └── Dockerfile
```

## Installation

From the `demo-app` directory, install dependencies:

```bash
cd demo-app
npm install
```

## Running locally

```bash
npm start
```

Open `http://localhost:4200`. The app reloads automatically on file changes.

## Running tests

```bash
npm test
```

This opens a Chrome browser and runs tests in watch mode. To run headless without watch (e.g. in CI):

```bash
npm test -- --no-watch --browsers=ChromeHeadless
```

## Building for production

```bash
npm run build
```

Output is written to `demo-app/dist/`. This is not required for local development.

## Docker

Docker builds the production bundle and serves it via nginx — no local Node.js install required.

From the `demo-app` directory:

```bash
docker build -t demo-app .
docker run -p 8080:80 demo-app
```

Or as a single command:

```bash
docker build -t demo-app . && docker run -p 8080:80 demo-app
```

Open `http://localhost:8080`.