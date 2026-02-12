# Digitalisation Scolaire (discolaire)

## Overview

Platform for school management.

## System Requirements

- Linux: 8GB RAM, 120GB disk
- Windows (64-bit): 8GB RAM, 120GB disk

## Quick Start (recommended)

1. Install dependencies
   - `pnpm i`
2. Configure environment variables
   - Copy `.env.example` to `.env`
3. Push the Prisma schema to the database
   - `pnpm db:push`
4. Run the frontend
   - `npx turbo run dev -F @repo/frontend`

## Installation

Linux is strongly recommended (Ubuntu or Debian).

### Linux

1. Copy `setup.sh`, `env.example`, and `database.sql` into your working directory
2. Run `chmod +x setup.sh`
3. Run `./setup.sh`

### Windows

1. Install PostgresSQL, PgAdmin4, Git, and Node.js (see Resources)
2. `git clone` the repo and navigate into it
3. Copy and rename `env.example` to `.env`
4. Install global tools: `npm install -g pnpm pm2`

## Desktop (Electron)

The desktop app wraps the Next.js frontend in Electron.

- Open the app bundle (macOS): `open apps/desktop/dist/app/mac-arm64/Discolaire.app`

### Desktop dev

```bash
pnpm dev:desktop
```

### Desktop build

```bash
pnpm build:desktop
```

## Deployment

### AWS S3 or MinIO

- Start MinIO locally:
  - `./minio server --console-address :9001 ./data --address ":9310"`
- Create a public avatars bucket and set env `S3_AVATAR_BUCKET_NAME`
- Create an admin policy for read/write on all buckets:

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

- On AWS, limit resources, e.g. `arn:aws:s3:::discolaire-avatars-f4a2c9/*`
- Create a policy for a public bucket:

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

Notes:

- `--address` is used for API calls, `--console-address` is for the UI

## Docker

- Build:
  - `docker build -f apps/frontend/Dockerfile . --progress=plain --no-cache`
- Run:
  - `docker compose up --build`
- See Resources for the Next.js Docker discussion and the previous Dockerfile reference

### Docker - no more space

```bash
docker system df # display disk usage
docker image prune -a -f # remove unused images
docker buildx prune -f # clear build cache

docker system prune -f # clean all, remove all unused docker
```

## Turborepo

- If you see `Failed to connect to daemon` with `channel closed`, run:
  - `npx turbo daemon restart`

## Troubleshooting / Known Issues

- Prisma error: `Invalid create() Unique constraint failed on the fields: (id)`

```bash
ssh root@37.27.188.136
docker exec -it qgs0so4 bash
SELECT setval(pg_get_serial_sequence('"Section"', 'id'), coalesce(max(id) + 1, 1), false ) FROM "Section";
```

## Utilities and Notes

### PM2

- `pm2 delete id_or_name`, `pm2 stop id_or_name`, `pm2 delete all`
- Install ts-node globally: `npm install -g ts-node typescript`
- Install `pm2` globally
- Configure `pm2` to autostart on reboot

### NVM

```bash
nvm list
nvm ls-remote
nvm install 8.10.0
nvm use 8.10.0
nvm alias default 8.10.0
nvm uninstall <old_version>
pnpm i -g pnpm
```

### Prisma / Postgres

```bash
pn i --reporter append-only

export PATH="/Library/PostgreSQL/16/bin:$PATH"
pg_restore -d 'postgres://{user}:{password}@{hostname}:{port}/{database-name}' database_dump.dump

datasource db {
provider = "postgresql"
url = env("POSTGRES_PRISMA_URL") // uses connection pooling
directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}
```

### DB Maintenance

- Drop DB: `sudo -u postgres dropdb discolaire`
- Drop user: `sudo -u postgres dropuser discolaire`
- After `pn db:push`, run `pn db:generate`
- Remove a tracked file: `git rm -r --cached <file_path>`

### Misc

- When using Table context in reports/ see Resources
- Use `className="resize-none"` for textarea
- Remove `"dev": "email dev -p 3001",` from transactional
- Fix places using `gradeSheet.grades` followed by max/min/avg of grades (no longer returns all grades for student or parent)
- `npx sort-package-json`
- `git commit --no-verify --message \"\"` to skip husky, after `git add -A .`

## Ports

| Service   | Port |
| --------- | ---- |
| Messaging | 6000 |

## Resources

### Setup and Tooling

- PostgresSQL (Windows installer)
- PgAdmin4 (Windows installer)
- Git Desktop (Windows installer)
- Node.js (Windows installer)
- Turborepo issue (channel closed)
- Prisma discussion (unique constraint failed)
- Next.js Docker discussion

### UI / Design Inspiration

- Shadcn UI Big Calendar (package.json)
- Index Education (Pronote demo)
- Shadbook App
- Facebook photo reference
- Threads clone UserProfile.tsx
- V0 chat (page improvement)
- Expo Icons
- Bolt.new example
- V0 chat (grades management dashboard)
- UI blocks (ahmet.studio)
- Kibo UI
- Magic UI
- OpenStatus template (dashboard monitors)
- Reui blocks
- Kibo UI banner
- SMS gateway (DRC)
- Kibo UI dialog stack
- Metronic Tailwind React demo
- Conservice utilities info
- Kibo UI pill
- OpenStatus template (settings)
- SHSF UI
- Shadcn UI dialog example

### Email / SES

- Mailbluster: get out of AWS SES sandbox
- Mailbluster: increase send limit

### Other

- Screenzy
- Square (lndev)
- Previous Dockerfile reference
- Table context in reports

### URLs

- https://www.postgresql.org/download/windows/
- https://www.pgadmin.org/download/pgadmin-4-windows/
- https://desktop.github.com/download/
- https://nodejs.org/en/download
- https://github.com/vercel/turborepo/issues/9016
- https://github.com/prisma/prisma/discussions/5256
- https://github.com/vercel/next.js/discussions/35437
- https://github.com/jpainam/discolaire/blob/2bd5f43491d18e2583296a8fb03b14cd457282b9/packages/reports/src/table/Table.tsx
- https://github.com/list-jonas/shadcn-ui-big-calendar/blob/main/package.json
- https://www.index-education.com/fr/pronote-info191-demo-des-espaces-web-et-mobile.php
- https://shadbook-app.vercel.app/
- https://www.facebook.com/photo/?fbid=1442342332621612&set=pb.100068836477828.-2207520000&checkpoint_src=any
- https://github.com/Galaxies-dev/threads-clone-react-native/blob/main/components/UserProfile.tsx
- https://v0.dev/chat/page-improvement-needed-lzzqaWgCK4l
- https://icons.expo.fyi/Index
- https://bolt.new/~/sb1-jprga2td
- https://v0.dev/chat/grades-management-dashboard-Bl5ILGqJQYp
- https://ui.ahmet.studio/blocks
- https://www.kibo-ui.com/
- https://magicui.design/
- https://template.openstatus.dev/dashboard/monitors/overview
- https://reui.io/blocks
- https://www.kibo-ui.com/components/banner
- https://www.sendsmsgate.com/fr/sms-gateway/cd/democratic-republic-of-the-congo/
- https://www.kibo-ui.com/components/dialog-stack
- https://keenthemes.com/metronic/tailwind/react/demo1
- https://utilitiesinfo.conservice.com/
- https://www.kibo-ui.com/components/pill
- https://template.openstatus.dev/dashboard/settings/general
- https://www.shsfui.com/
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/radix/examples/dialog-example.tsx
- https://mailbluster.com/blog/get-out-of-aws-ses-sandbox-and-increase-send-limit-and-or-send-rate-2022
- https://mailbluster.com/blog/getting-out-of-amazon-ses-sandbox
- https://screenzy.io/
- https://square.lndev.me/
- https://github.com/jpainam/discolaire/blob/4324613a0d0feec36b01a659a814b5a58ec8d4d5/apps/frontend/Dockerfile
- https://miale.ac.ke/biometric-integration
