#!/bin/sh

printf "\n\nBuild travels..."
node ./scripts/build-travels.js

printf "\n\nBuild images..."
node ./scripts/build-images.js

printf "\n\nSimplify tracks..."
./scripts/simplify-tracks.sh

printf "\n\nCreate thumbnails..."
./scripts/create-thumbnails.sh

npm run production
