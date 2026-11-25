#!/bin/sh
set -eu

cd "$(dirname "$0")/.."
npm run build -- "$@"

mkdir -p build
stage=$(mktemp -d build/.deployment.XXXXXX)
trap 'rm -rf "$stage"' EXIT
archive="$stage/shaheenautomotive-deployment.zip"

zip -q -r "$archive" \
  .next public server.js next.config.js package.json package-lock.json .env.example README.md \
  src/lib/image-config.json src/lib/image-loader.ts \
  src/lib/server/database.mjs src/lib/server/mysql-schema.mjs \
  src/lib/server/password.mjs src/lib/server/sqlite-legacy.mjs \
  scripts/mysql-env.mjs scripts/migrate-mysql.mjs scripts/provision-admin.mjs scripts/import-sqlite.mjs \
  -x '.next/cache*' '.next/dev/*' '.next/dev/' '.next/diagnostics*' '.next/trace*' \
     '.next/types*' '.next/turbopack' 'public/.htaccess' '*/.DS_Store'

unzip -tq "$archive"
mv "$archive" build/shaheenautomotive-deployment.zip
ls -lh build/shaheenautomotive-deployment.zip
