#!/bin/bash

set -e

echo "🔧 Installing Homebrew if not already installed..."
if ! command -v brew &> /dev/null; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi

echo "🔧 Updating brew and installing dependencies..."
brew update
brew install git node redis postgresql minio/stable/minio pnpm pm2

echo "✅ Dependencies installed"

# 1. Clone your repo
REPO_URL="https://github.com/jpainam/discolaire.git"
APP_DIR="$HOME/discolaire"

echo "📦 Cloning repo into $APP_DIR..."
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# 2. Install Node modules and build
echo "📥 Installing dependencies with pnpm..."
pnpm install

echo "🏗️ Building the app..."
pnpm build

# 3. Start your app with PM2
echo "🚀 Starting Next.js app with PM2..."
pm2 start "pnpm --filter frontend start" --name discolaire-app

# 4. Start MinIO using PM2
echo "🗃️ Starting MinIO..."
mkdir -p ~/minio/data
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin
pm2 start "minio server ~/minio/data --console-address ':9001'" --name minio

# 5. Start Redis and PostgreSQL
echo "💾 Starting Redis and PostgreSQL services..."
brew services start redis
brew services start postgresql

# 6. Save and enable PM2 startup
pm2 save
pm2 startup
echo "✅ PM2 processes saved and startup setup"


echo "🛠️ Installing MinIO Client (mc)..."
brew install minio/stable/mc

echo "🔗 Connecting mc to local MinIO server..."
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin

echo "🪣 Creating buckets: documents, images, avatars..."
for bucket in documents images avatars; do
  mc mb local/$bucket || true
  mc anonymous set public local/$bucket
done

echo "✅ Buckets created and set to public access."

echo "✅ All services are up and running."
echo "✅ Visit your app and MinIO at http://localhost:3000 and http://localhost:9001"