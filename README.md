## Export all images

```
# Export images from Darktable and JPG folders
node scripts/export-images.js
# Sync images to remote server
scripts/sync-images.sh
```



## Develop locally

Build assets:

```
# Create track "thumbnails"
scripts/simplify-tracks.sh
# Build travel metadata
node build-travels.js


# Create thumbnails
scripts/create-thumbnails.sh
# Build image metadata
node scripts/build-images.js
```

Run:

```
npm install
npm start
```

## Deploy on a server behind [traefik](https://github.com/traefik/traefik)

```
docker-compose up -d
```
