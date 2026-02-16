# Discolaire Desktop

Electron wrapper that bundles the Next.js frontend as a standalone desktop application. Users install the app, provide their own environment configuration, and run Discolaire locally without needing the full development setup.

## Prerequisites

- **Node.js** >= 24.10.0
- **pnpm** >= 10.27.0

## How It Works

The build process:

1. Builds the Next.js frontend in standalone mode (`output: "standalone"`)
2. Copies the standalone output into `build/frontend/`
3. Compiles the Electron main process (`src/main.ts` → `dist/main.js`)
4. Packages everything with `electron-builder` into a platform-specific installer

At runtime, the Electron app:

1. Reads environment variables from `discolaire.env` in the user data directory
2. Starts the embedded Next.js server on port 3000
3. Opens a browser window pointing to `http://127.0.0.1:3000`

## Build the Installer

From the **repository root**:

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Generate Prisma client (required before building)
pnpm db:generate

# 3. Build the desktop app (builds frontend + packages Electron)
pnpm build:desktop
```

Or from `apps/desktop/`:

```bash
pnpm build
```

The installer will be created in `apps/desktop/dist/app/`:

| Platform | Output |
|----------|--------|
| macOS    | `.dmg` file |
| Windows  | NSIS installer (`.exe`) |
| Linux    | `.AppImage` |

### Building for a Specific Platform

The frontend build is platform-independent — you only need to run it once. Then pass a platform flag to `electron-builder`:

```bash
# 1. Build frontend + compile main process (do this once)
pnpm run build:frontend
tsup src/main.ts --format cjs --out-dir dist --clean --external electron

# 2. Package for your target platform
electron-builder --mac        # macOS .dmg
electron-builder --linux      # Linux .AppImage
electron-builder --win        # Windows .exe (see cross-compilation notes below)
```

### Cross-Compilation from macOS

| Target   | Build from macOS? | Notes |
|----------|-------------------|-------|
| macOS    | Yes               | Native build, works out of the box |
| Linux    | Yes               | Works out of the box, electron-builder handles it |
| Windows  | No                | Requires Windows or CI (see below) |

**Why Windows builds don't work from macOS**: electron-builder needs Windows-specific tools (NSIS installer compiler, code signing utilities) that don't run natively on macOS. While Wine-based cross-compilation exists, it is fragile and not recommended.

### Building for Windows

Pick one of these approaches:

**Option A — GitHub Actions (recommended)**

Add a workflow that builds on all three platforms. Create `.github/workflows/desktop-build.yml`:

```yaml
name: Build Desktop

on:
  workflow_dispatch:
  push:
    tags:
      - "desktop-v*"

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install
      - run: pnpm db:generate
      - run: pnpm build:desktop
      - uses: actions/upload-artifact@v4
        with:
          name: desktop-${{ matrix.os }}
          path: apps/desktop/dist/app/*
```

Push a tag like `desktop-v0.1.0` to trigger builds for all platforms. Download the Windows `.exe` from the workflow artifacts.

**Option B — Build on a Windows machine or VM**

```powershell
# On Windows (PowerShell)
git clone <repo-url>
cd discolaire
pnpm install
pnpm db:generate
pnpm build:desktop
# Output: apps\desktop\dist\app\Discolaire Setup *.exe
```

**Option C — Windows VM via cloud**

Use a GitHub Codespace, Azure VM, or AWS EC2 Windows instance to run the build remotely.

## Setup for the End User

After installing the app, the user must create an environment file before launching.

### 1. Locate the User Data Directory

| OS      | Path |
|---------|------|
| macOS   | `~/Library/Application Support/Discolaire/` |
| Windows | `%APPDATA%\Discolaire\` |
| Linux   | `~/.config/Discolaire/` |

### 2. Create `discolaire.env`

Create a file named `discolaire.env` in the user data directory above. Copy the template below and fill in the values for your environment:

```env
# --- Required ---

# Base URL (keep as-is for local desktop usage)
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000

# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Authentication
AUTH_SECRET=<generate-a-random-secret>
AUTH_TRUST_HOST=true

# Default tenant
DEFAULT_TENANT=demo

# Redis
REDIS_URL=redis://localhost:6379

# --- Object Storage (S3 / MinIO) ---

S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=<your-key>
S3_SECRET_ACCESS_KEY=<your-secret>
S3_BUCKET_NAME=<your-bucket>
S3_AVATAR_BUCKET_NAME=avatars
S3_IMAGE_BUCKET_NAME=images
S3_DOCUMENT_BUCKET_NAME=documents

# --- Optional / Feature-specific ---

# AI
AI_GATEWAY_API_KEY=<key>
AI_PROVIDER=openai
AI_MODEL=openai/gpt-4o-mini

# Messaging
MESSAGING_SERVICE_URL=https://messaging.discolaire.com
MESSAGING_SECRET_KEY=<key>

# Notifications
NOVU_API_KEY=<key>

# SMS (twilio, vonage, or sns)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_SMS_FROM=<phone>

# WhatsApp
WHATSAPP_API_TOKEN=<token>
WHATSAPP_VERIFY_TOKEN=<token>
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=<id>

# Discord OAuth (if using Discord login)
AUTH_DISCORD_ID=<id>
AUTH_DISCORD_SECRET=<secret>

# Sentry (error tracking)
SENTRY_AUTH_TOKEN=<token>

# Resend (emails)
RESEND_API_KEY=<key>
```

### 3. Launch the App

Open **Discolaire** from your Applications folder (macOS), Start Menu (Windows), or run the AppImage (Linux). The app will:

1. Read `discolaire.env` from the user data directory
2. Start the embedded Next.js server
3. Open the main window once the server is ready

If the env file is missing, an error dialog will appear with the expected path.

## Troubleshooting

**Logs** are written to:

| OS      | Path |
|---------|------|
| macOS   | `~/Library/Application Support/Discolaire/desktop.log` |
| Windows | `%APPDATA%\Discolaire\desktop.log` |
| Linux   | `~/.config/Discolaire/desktop.log` |

Common issues:

- **"Server entry not found"** — The frontend was not bundled correctly. Rebuild with `pnpm build:desktop`.
- **"Runtime env file not found"** — Create `discolaire.env` in the user data directory (see above).
- **Server not ready after 30s** — Check that `DATABASE_URL` and `REDIS_URL` point to reachable services. Inspect `desktop.log` for details.
- **Blank window** — Check `desktop.log` for server startup errors. Ensure all required env vars are set.

## Development

```bash
# From the repository root
pnpm dev:desktop
```

This starts three concurrent processes:

1. Next.js dev server on `http://localhost:3000`
2. Electron main process compiler (watch mode)
3. Electron app (auto-reloads on changes)
