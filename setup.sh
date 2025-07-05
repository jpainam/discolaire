#!/bin/bash

set -e

echo "Loading environment..."
export $(grep -v '^#' .env | sed 's/#.*//' | xargs)

echo "Starting docker services..."

docker compose build --no-cache
docker compose up -d

#COMPOSE_BAKE=true docker compose up --build -d

echo "Waiting for MinIO to start..."
sleep 5  # Adjust if needed

echo "Configuring MinIO buckets..."

# Create MinIO alias using mc client
docker run --rm --network host minio/mc alias set localminio http://localhost:${MINIO_PORT} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create buckets
docker run --rm --network host minio/mc mb localminio/images || true
docker run --rm --network host minio/mc mb localminio/avatars || true
docker run --rm --network host minio/mc mb localminio/documents || true

# Set access policies (optional)
docker run --rm --network host minio/mc policy set public localminio/images
docker run --rm --network host minio/mc policy set public localminio/avatars
docker run --rm --network host minio/mc policy set private localminio/documents

echo "MinIO buckets configured."
