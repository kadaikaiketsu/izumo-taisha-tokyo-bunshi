#!/bin/bash
# Cloudflare Pages デプロイスクリプト

set -e

echo "🔨 Building project..."
npm run build

echo "🚀 Deploying to Cloudflare Pages..."
# .envファイルから環境変数を読み込む
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

npx wrangler pages deploy dist --project-name=izumo-taisha-tokyo-bunshi --branch=main

echo "✅ Deployment complete!"
