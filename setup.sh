# make sure meta and gulp are installed
npm install -g meta gulp

# checkout all repos in the correct branch
meta git update
meta exec "git checkout develop" --exclude process_engine_meta

# retrieve latest versions
meta git pull

# install all necessary dependencies
npm install --no-package-lock

# build all packages and schemas
meta exec "npm run build" --exclude consumer_api_meta
