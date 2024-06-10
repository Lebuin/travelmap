#!/bin/sh

echo "\n\nBuild travels..."
node ./scripts/build-travels.js

echo "\n\nBuild images..."
node ./scripts/build-images.js

echo "\n\nSimplify tracks..."
./scripts/simplify-tracks.sh

echo "\n\nCreate thumbnails..."
./scripts/create-thumbnails.sh

npm run production
