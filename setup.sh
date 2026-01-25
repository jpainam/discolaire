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
SQL_DUMP="$(pwd)/database.sql"
if [ ! -f "$SQL_DUMP" ]; then
  echo "❌ Error: Dump file '$SQL_DUMP' not found."
  exit 1
fi

# Check if the database already contains data
HAS_DATA=$(PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h localhost -d "$POSTGRES_DB" -t -c \
"SELECT EXISTS (
   SELECT 1 FROM information_schema.tables t
   JOIN pg_class c ON t.table_name = c.relname
   WHERE t.table_schema = 'public'
   AND c.reltuples > 0
);")

if [[ "$HAS_DATA" =~ "f" ]]; then
  echo "📄 Database is empty. Restoring from $SQL_DUMP..."
  PGPASSWORD="$POSTGRES_PASSWORD" pg_restore --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h localhost "$SQL_DUMP"
else
  echo "✅ Database already contains data. Skipping restore."
fi

# 2. Clone your repo
REPO_URL="https://github.com/jpainam/discolaire.git"
APP_DIR="$HOME/discolaire"

if [ -d "$APP_DIR/.git" ]; then
  echo "📁 $APP_DIR already exists. Resetting to remote state..."
  cp "$(dirname "${BASH_SOURCE[0]}")/env.example" "$APP_DIR/.env"
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
else
  echo "📦 Cloning repo into $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
  cp "$(dirname "${BASH_SOURCE[0]}")/env.example" "$APP_DIR/.env"
  cd "$APP_DIR"
fi


# 3. Install Node modules and build
echo "📥 Installing dependencies with pnpm..."
pnpm install

echo "🏗️ Building the app..."
pnpm build

# 4. Start your app with PM2
echo "🚀 Starting Next.js app with PM2..."

pm2 start "pnpm --filter frontend start" --name discolaire-app

# 5. Start MinIO using PM2
echo "🗃️ Starting MinIO..."
if [ ! -d "$HOME/minio/data" ]; then
  mkdir -p "$HOME/minio/data"
fi
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin
pm2 start "minio server ~/minio/data --console-address ':$MINIO_CONSOLE_PORT'" --name minio

# 6. Enable Redis and PostgreSQL
echo "💾 Enabling Redis and PostgreSQL services..."
sudo systemctl enable --now redis-server
sudo systemctl enable --now postgresql

# 7. Save and enable PM2 startup
pm2 save
pm2 startup --silent | bash

# 8. Create MinIO buckets
echo "🔗 Connecting mc to local MinIO server..."
mc alias set local http://127.0.0.1:$MINIO_API_PORT minioadmin minioadmin

echo "🪣 Creating buckets: documents, images, avatars..."
for bucket in documents images avatars; do
  mc mb local/$bucket || true
  mc anonymous set public local/$bucket
done

source ~/.bashrc
echo "✅ Buckets created and set to public access."
echo "✅ All services are up and running."
echo "➡️ Visit MinIO Console:  http://localhost:9001"
