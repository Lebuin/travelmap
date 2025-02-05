#!/bin/sh
set -e

printf "Build travels...\n"
node ./scripts/build-travels.js

printf "\nSync images...\n\n"
node ./scripts/sync-images.js

printf "\nBuild images...\n\n"
node ./scripts/build-images.js

printf "\nSimplify tracks...\n\n"
./scripts/simplify-tracks.sh

printf "\nCreate thumbnails...\n\n"
./scripts/create-thumbnails.sh

npm run build
npm run start
