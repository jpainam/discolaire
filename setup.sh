#!/bin/bash

set -e
set -a
source env.example
set +a

echo "🔧 Updating package index and installing core dependencies..."
sudo apt update
sudo apt install -y curl git redis postgresql unzip wget build-essential

echo "📦 Installing latest Node.js via NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22

echo "📦 Installing pnpm and pm2 globally..."
npm install -g pnpm pm2


echo "✅ Dependencies installed"


TMP_DIR=$(mktemp -d)

# Download MinIO
if ! command -v minio &> /dev/null; then
  echo "⬇️  Downloading MinIO..."
  wget -q https://dl.min.io/server/minio/release/linux-amd64/minio -O "$TMP_DIR/minio"
  chmod +x "$TMP_DIR/minio"
  sudo mv "$TMP_DIR/minio" /usr/local/bin/minio
else
  echo "🟢 MinIO already installed, skipping download."
fi

# Download mc
if ! command -v mc &> /dev/null; then
  echo "⬇️  Downloading MinIO Client (mc)..."
  wget -q https://dl.min.io/client/mc/release/linux-amd64/mc -O "$TMP_DIR/mc"
  chmod +x "$TMP_DIR/mc"
  sudo mv "$TMP_DIR/mc" /usr/local/bin/mc
else
  echo "🟢 mc already installed, skipping download."
fi

rm -rf "$TMP_DIR"


echo "🛠️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" || true
sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;" || true

DB_EXISTS=$(PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'")

if [ -f "./database.sql" ] && [ "$DB_EXISTS" != "1" ]; then
  echo "📄 Importing database.sql..."
  chmod +r ./database.sql
  PGPASSWORD="$POSTGRES_PASSWORD" pg_restore --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h localhost "$(pwd)/database.sql"
else
  echo "⚠️ database.sql not found, skipping import."
fi

# 2. Clone your repo
REPO_URL="https://github.com/jpainam/discolaire.git"
APP_DIR="$HOME/discolaire"

if [ -d "$APP_DIR/.git" ]; then
  echo "📁 $APP_DIR already exists. Skipping clone."
else
  echo "📦 Cloning repo into $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
fi

cp "$(dirname "$0")/env.example" "$APP_DIR/.env"
cd "$APP_DIR"

# 3. Install Node modules and build
echo "📥 Installing dependencies with pnpm..."
pnpm install

echo "🏗️ Building the app..."
pnpm build

# 4. Start your app with PM2
echo "🚀 Starting Next.js app with PM2..."
pm2 delete all
pm2 start "pnpm --filter frontend start" --name discolaire-app

# 5. Start MinIO using PM2
echo "🗃️ Starting MinIO..."
if [ ! -d "$HOME/minio/data" ]; then
  mkdir -p "$HOME/minio/data"
fi
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin
pm2 start "minio server ~/minio/data --console-address ':9001'" --name minio

# 6. Enable Redis and PostgreSQL
echo "💾 Enabling Redis and PostgreSQL services..."
sudo systemctl enable --now redis-server
sudo systemctl enable --now postgresql

# 7. Save and enable PM2 startup
pm2 save
pm2 startup --silent | bash

# 8. Create MinIO buckets
echo "🔗 Connecting mc to local MinIO server..."
mc alias set local $NEXT_PUBLIC_MINIO_URL minioadmin minioadmin

echo "🪣 Creating buckets: documents, images, avatars..."
for bucket in documents images avatars; do
  mc mb local/$bucket || true
  mc anonymous set public local/$bucket
done

source ~/.bashrc
echo "✅ Buckets created and set to public access."
echo "✅ All services are up and running."
echo "➡️ Visit your app:        http://localhost:3000"
echo "➡️ Visit MinIO Console:  http://localhost:9001"

