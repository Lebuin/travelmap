# Develop locally

Build assets:

```
# Create track "thumbnails"
scripts/simplify-tracks.sh
# Build travel metadata
node scripts/build-travels.js


# Create thumbnails
scripts/create-thumbnails.sh
# Build image metadata
scripts/build-images.js
```

Run:

```
npm install
npm start
```

Visit localhost:8080


# Deploy on a server behind [traefik](https://github.com/traefik/traefik)

```
docker-compose up -d
```



# Regular tasks

## Export images

```
# Export images from Darktable and JPG folders (optionally specify travels for which to do this)
node scripts/export-images.js [travel...]

# Sync images to remote server
scripts/sync-images.sh
```


## Add (better) elevation data to a gpx file

https://www.gpsvisualizer.com/elevation


## Create a gpx track routed on railways

See Documents/programming/open-rail-routing/README.md


## Update elevations of a RWGPS track

```
./scripts/update-elevations.mjs src/assets/tracks/<travel>.json
```
