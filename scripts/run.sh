#!/bin/sh

node ./scripts/build-travels.js
node ./scripts/build-images.js
./scripts/simplify-tracks.sh
./scripts/create-thumbnails.sh

npm run production
