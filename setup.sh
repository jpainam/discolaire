#!/bin/bash

set -e
export NODE_OPTIONS="--max-old-space-size=3072"

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

# Install MinIO
echo "🗃️ Installing MinIO..."
wget https://dl.min.io/server/minio/release/linux-amd64/minio -O minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Install MinIO Client (mc)
echo "🛠️ Installing MinIO Client (mc)..."
wget https://dl.min.io/client/mc/release/linux-amd64/mc -O mc
chmod +x mc
sudo mv mc /usr/local/bin/

# 1. Clone your repo
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

# 2. Setup PostgreSQL database and import schema
DB_NAME="discolaire"
DB_USER="discolaire"
DB_PASS="securepassword"  # change this as needed

echo "🛠️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || true

if [ -f "./database.sql" ]; then
  echo "📄 Importing database.sql..."
  sudo -u postgres psql -d $DB_NAME -f ./database.sql
else
  echo "⚠️ database.sql not found, skipping import."
fi

# 3. Install Node modules and build
echo "📥 Installing dependencies with pnpm..."
pnpm install

echo "📀 Adding swap space if needed..."
sudo fallocate -l 2G /swapfile || true
sudo chmod 600 /swapfile || true
sudo mkswap /swapfile || true
sudo swapon /swapfile || true
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab || true
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

echo "🏗️ Building the app..."
pnpm build --concurrency=1

# 4. Start your app with PM2
echo "🚀 Starting Next.js app with PM2..."
pm2 start "pnpm --filter frontend start" --name discolaire-app

# 5. Start MinIO using PM2
echo "🗃️ Starting MinIO..."
mkdir -p ~/minio/data
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
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin

echo "🪣 Creating buckets: documents, images, avatars..."
for bucket in documents images avatars; do
  mc mb local/$bucket || true
  mc anonymous set public local/$bucket
done

echo "✅ Buckets created and set to public access."
echo "✅ All services are up and running."
echo "➡️ Visit your app:        http://localhost:3000"
echo "➡️ Visit MinIO Console:  http://localhost:9001"
