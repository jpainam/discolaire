# Digitalisation Scolaire (discolaire)

## Configuration système requise

- Linux 8GB RAM, 120GB Disque
- Windows 64 Bits, 8GB RAM, 120GB Disque

## Installation

Il est fortement conseillé d'utiliser une distribution Linux (Ubuntu ou Debian)

### Linux

1. Copier les fichier `setup.sh`, `env.example` et `database.sql` dans votre dossier de travail
2. Ouvrir le terminal est executer `chmod +x setup.sh`
3. Executer `./setup.sh`

### Windows

1. Installer [PostgresSQL](https://www.postgresql.org/download/windows/), [PgAdmin4](https://www.pgadmin.org/download/pgadmin-4-windows/), [Git](https://desktop.github.com/download/), [NodeJs](https://nodejs.org/en/download)
2. CMD `git clone  https://github.com/jpainam/discolaire.git` et naviguer dans le dossier
3. Copier et renommer `env.example` en `.env`
4. CMD `npm install -g pnpm pm2`

### Commande utils

- `pm2`
- - `pm2 delete id_or_name`, `pm2 stop id_or_name`, `pm2 delete all

* Install ts-node globally
  `npm install -g ts-node typescript`
* Install `pm2` globally
* Configure `pm2` to autostart on reboot

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

## Deployment

### AWS S3 or MINIO

- ./minio server --console-address :9001 ./data --address ":9310"

- Create a public avatars bucket and set the env `S3_AVATAR_BUCKET_NAME`
- Create a admin policy for readwrite on all bucket

```bash
{
 "Version": "2012-10-17",
 "Statement": [
  {
   "Effect": "Allow",
   "Action": [
    "s3:*"
   ],
   "Resource": [
    "arn:aws:s3:::*"
   ]
  }
 ]
}
```

- NB: On AWS, limit the ressources, for e.g., `arn:aws:s3:::discolaire-avatars-f4a2c9/*`
- Create a policy for public bucket

```bash
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Effect": "Allow",
        "Principal": {
            "AWS": "*"
        },
        "Action": [
            "s3:GetObject"
        ],
        "Resource": [
            "arn:aws:s3:::avatars/*"
        ]
    }
    ]
}
```

- - Locally MiNio using `./minio server --console-address ":9001" ./data --address ":9310"`
- The --address is used for api calls, the --console-address is used for the UI

## Turborepo

https://github.com/vercel/turborepo/issues/9016

# Bugs

- turbo repo channel closed

```bash
 × Failed to connect to daemon.
  ╰─▶ server is unavailable: channel closed
```

Solve by running `npx turbo daemon restart`

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

# Docker

`docker build -f apps/frontend/Dockerfile . --progress=plain --no-cache`
`docker compose up --build`

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

```
pn i --reporter append-only

export PATH="/Library/PostgreSQL/16/bin:$PATH"
pg_restore -d 'postgres://{user}:{password}@{hostname}:{port}/{database-name}' database_dump.dump

datasource db {
provider = "postgresql"
url = env("POSTGRES_PRISMA_URL") // uses connection pooling
directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}
```

When using Table context in reports/
https://github.com/jpainam/discolaire/blob/2bd5f43491d18e2583296a8fb03b14cd457282b9/packages/reports/src/table/Table.tsx

https://github.com/list-jonas/shadcn-ui-big-calendar/blob/main/package.json

https://www.index-education.com/fr/pronote-info191-demo-des-espaces-web-et-mobile.php

className="resize-none" for textarea

```
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  // "schedule": [ "every weekend"],
  "schedule": ["before 7am on the first day of the month"],

  "ignoreDeps": ["postgres"],
  "rangeStrategy": "update-lockfile",
  "packageRules": [
    {
      "description": "Group minor and patch dependency updates",
      "matchPackagePatterns": ["*"],
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "all non-major dependencies",
      "groupSlug": "all-minor-patch"
    }
  ]
}
```

https://shadbook-app.vercel.app/
https://www.facebook.com/photo/?fbid=1442342332621612&set=pb.100068836477828.-2207520000&checkpoint_src=any
https://github.com/Galaxies-dev/threads-clone-react-native/blob/main/components/UserProfile.tsx
https://v0.dev/chat/page-improvement-needed-lzzqaWgCK4l
https://icons.expo.fyi/Index

https://bolt.new/~/sb1-jprga2td
https://v0.dev/chat/grades-management-dashboard-Bl5ILGqJQYp

https://ui.ahmet.studio/blocks

https://www.kibo-ui.com/

https://magicui.design/

# Drop DB

sudo -u postgres dropdb discolaire

# Drop user

sudo -u postgres dropuser discolaire

https://template.openstatus.dev/dashboard/monitors/overview

https://reui.io/blocks
https://www.kibo-ui.com/components/banner
https://www.sendsmsgate.com/fr/sms-gateway/cd/democratic-republic-of-the-congo/
https://www.kibo-ui.com/components/dialog-stack
https://reui.io/blocks
https://keenthemes.com/metronic/tailwind/react/demo1
https://utilitiesinfo.conservice.com/

PILL https://www.kibo-ui.com/components/pill
https://www.kibo-ui.com/components/banner
https://template.openstatus.dev/dashboard/settings/general
https://www.shsfui.com/

pg_restore --dbname "postgres://postgres:postgres@localhost:5432/ipbw3" --no-owner backup.sql

`pn db:generate`, after `pn db:push`

git rm -r --cached <file_path>

The docker https://github.com/vercel/next.js/discussions/35437
My previous docker https://github.com/jpainam/discolaire/blob/4324613a0d0feec36b01a659a814b5a58ec8d4d5/apps/frontend/Dockerfile

fix everywhere i use gradeSheet.grades followed by max, min, or avg of grades
as this will no longer return all grades (e.g. if student is logged)
or parent.

work on getGeneratorUrl as termType is hardcoded


[TRPC] reportCard.getSequence took 42.04408300000068ms to execute
[TRPC] student.get took 21.668584000006376ms to execute
[TRPC] student.get took 16.468333999997412ms to execute
[TRPC] classroom.subjects took 6.2300410000025295ms to execute
[TRPC] student.get took 17.489000000001397ms to execute
[TRPC] term.get took 8.02166600000055ms to execute
[TRPC] student.get took 14.347332999997889ms to execute
[TRPC] student.get took 19.167083000000275ms to execute
[TRPC] classroom.get took 14.542583000002196ms to execute
[TRPC] student.get took 16.464292000004207ms to execute
[TRPC] discipline.sequence took 18.297082999997656ms to execute

[TRPC] student.get took 2245.4543330000015ms to execute

[TRPC] appreciation.categories took 11.326374999996915ms to execute
[TRPC] classroom.subjects took 13.03679099999863ms to execute
[TRPC] term.get took 15.845792000000074ms to execute
[TRPC] classroom.get took 33.182708000000275ms to execute
[TRPC] classroom.students took 36.39900000000489ms to execute
[TRPC] gradeSheet.subjectWeight took 17.079625000005763ms to execute
[TRPC] user.getPermissions took 2.796249999999418ms to execute

[TRPC] classroom.gradesheets took 79.33291599999939ms to execute

[TRPC] skillAcquisition.all took 4.938207999999577ms to execute