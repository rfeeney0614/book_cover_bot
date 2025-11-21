#!/bin/bash
set -e

echo "Building React frontend..."
cd bookbot-frontend
npm install
REACT_APP_API_PROTOCOL=http REACT_APP_API_HOST=localhost REACT_APP_API_PORT=3000 npm run build

echo "Copying build to Rails public directory..."
mkdir -p ../bookbot-api/public
rm -rf ../bookbot-api/public/static ../bookbot-api/public/index.html ../bookbot-api/public/manifest.json ../bookbot-api/public/asset-manifest.json
cp -r build/* ../bookbot-api/public/

echo "Frontend build complete!"
