# make sure meta and gulp are installed
npm install -g meta gulp

# checkout all repos in the correct branch
meta git update
meta exec "git checkout feature/apply_consumer_api_concept" --exclude consumer_api_meta

# retrieve latest versions
meta git pull

# install all necessary dependencies
npm install --no-package-lock

# build all packages and schemas
meta exec "npm run build" --exclude consumer_api_meta

# create a database - TODO: Add Skeleton apps for consumer_api and reenable this
# cd skeleton/database
# node postgres_docker.js reset demo
# cd ../..

# tell the user how to run stuff - TODO: Add Skeleton apps for consumer_api and reenable this
# echo "run 'npm start' in 'skeleton/consumer-api-server-demo' to run the consumer-api"
# echo "run 'npm start' in 'bpmn-studio' to run the frontend"
