#!/bin/sh
set -eu

# Check if the /app/data directory is mounted
if [ ! -d "/app/data" ]; then
  echo "The '/app/data' volume mount was not configured properly. Mount the volume like this: '-v /path/to/data:/app/data'"
  exit 1
fi

npm run start:prod
