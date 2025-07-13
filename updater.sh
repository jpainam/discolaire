#!/bin/bash

set -e

echo "🔄 Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

echo "📦 Installing dependencies with pnpm..."
pnpm install

echo "🗄️ Pushing database schema..."
pnpm db:push

echo "🛠 Building @repo/frontend..."
pnpm build --filter @repo/frontend

echo "🚀 Restarting PM2 processes..."
pm2 restart all

echo "✅ Update complete."
