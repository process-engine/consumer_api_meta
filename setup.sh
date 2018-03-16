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

# create a database
# cd skeleton/database
# node postgres_docker.js reset demo
# cd ../..

# tell the user how to run stuff
# echo "run 'npm start' in 'skeleton/process-engine-server-demo' to run the process-engine"
# echo "run 'npm start' in 'bpmn-studio' to run the frontend"
