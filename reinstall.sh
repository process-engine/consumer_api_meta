# remove "node_modules"
echo "Purging node_modules..."
find . -name "node_modules" -exec rm -rf '{}' +
echo "Done. Starting setup..."

# install all necessary dependencies
npm install --no-package-lock

# build all packages and schemas
meta exec "npm run build && npm run build-schemas" --exclude consumer_api_meta

echo "done"
