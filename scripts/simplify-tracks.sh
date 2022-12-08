cd dist/assets/tracks/0

for f in *.json; do
  cat $f | npx simplify-geojson -t .01 > ../.01/$f
  cat $f | npx simplify-geojson -t .001 > ../.001/$f
done
