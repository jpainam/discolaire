# Digitalisation Scolaire (discolaire)

## Installation

```bash
git clone  https://github.com/jpainam/discolaire.git
```

## About

This project uses and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  ├─ expo
  |   ├─ Expo SDK 51
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using next-auth.
  ├─ db
  |   └─ Typesafe db calls using Prisma & Supabase
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@repo` as a placeholder for package names.

## Quick Start

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to the database
pnpm db:push
```

### 2. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` from `apps/expo`, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/mobile/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `pnpm dev` at the project root folder.

### 4a. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 4b. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## FAQ

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other apps you may add in the future, should only add the `api` package as a dev dependency. This lets you have full typesafety in your client applications, while keeping your backend code safe.

If you need to share runtime code between the client and server, such as input validation schemas, you can create a separate `shared` package for this and import it on both sides.

## Deployment

### Next.js

#### Prerequisites

> **Note**
> Please note that the Next.js application with tRPC must be deployed in order for the Expo app to communicate with the server in a production environment.

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

## Turborepo

https://github.com/vercel/turborepo/issues/9016

# Bugs

- `Invalid create() Unique constraint failed on the fields: (id)` https://github.com/prisma/prisma/discussions/5256

```bash
ssh root@37.27.188.136
docker exec -it qgs0so4 bash
SELECT setval(pg_get_serial_sequence('"Section"', 'id'), coalesce(max(id) + 1, 1), false ) FROM "Section";
```

- `npx sort-package-json`
- `git commit --no-verify --message ""` to skip husky, first `git add -A .`

| Service   | Port |
| --------- | ---- |
| Messaging | 6000 |

# Docker - no more space

https://depot.dev/blog/docker-clear-cache

```bash
docker system df # to display information regarding the amount of disk space used
docker image prune -a -f # to remove unused image
docker buildx prune -f # to clear the build cache

ATT
docker system prune -f # clean all, remove all unused docker
```

USE `npx turbo run dev -F @repo/frontend` to run

Remove `"dev": "email dev -p 3001",` from transactional

## nvm

```bash
nvm install 8.10.0
nvm use 8.10.0
nvm alias default 8.10.0
```

pn i --reporter append-only

export PATH="/Library/PostgreSQL/16/bin:$PATH"
pg_restore -d 'postgres://{user}:{password}@{hostname}:{port}/{database-name}' database_dump.dump

datasource db {
provider = "postgresql"
url = env("POSTGRES_PRISMA_URL") // uses connection pooling
directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}

When using Table context in reports/
https://github.com/jpainam/discolaire/blob/2bd5f43491d18e2583296a8fb03b14cd457282b9/packages/reports/src/table/Table.tsx

https://github.com/list-jonas/shadcn-ui-big-calendar/blob/main/package.json

https://www.index-education.com/fr/pronote-info191-demo-des-espaces-web-et-mobile.php
