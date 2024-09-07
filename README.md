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

Create an rclone config file with access to the gdrive-bijgaardehof-crypt remote at `rclone/rclone.conf`.

Run:

```
docker-compose up -d
```



# Regular tasks

## Export images

On personal pc:

* Export the images from darktable locally using `export-images`
* Add the path to the image folder to travels.csv
* Commit and push the changes

On server:

* Run `git pull && docker-compose down && docker compose up -d`


## Add (better) elevation data to a gpx file

https://www.gpsvisualizer.com/elevation


## Create a gpx track routed on railways

See Documents/programming/open-rail-routing/README.md


## Update elevations of a RWGPS track

```
./scripts/update-elevations.mjs src/assets/tracks/<travel>.json
```
