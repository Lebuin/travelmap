#!/bin/sh

printf "Build travels...\n"
node ./scripts/build-travels.js

printf "\nBuild images...\n\n"
node ./scripts/build-images.js

printf "\nSimplify tracks...\n\n"
./scripts/simplify-tracks.sh

printf "\nCreate thumbnails...\n\n"
./scripts/create-thumbnails.sh

npm build

exec npx http-server dist
