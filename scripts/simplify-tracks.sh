cd src/assets/tracks

rm -rf ../../../dist/assets/tracks
mkdir -p ../../../dist/assets/tracks
mkdir -p ../../../dist/assets/tracks/0.01
mkdir -p ../../../dist/assets/tracks/0.001
ln -s ../../../src/assets/tracks ../../../dist/assets/tracks/0

for f in *.json; do
  cat $f | npx simplify-geojson -t 0.01 > ../../../dist/assets/tracks/0.01/$f
  cat $f | npx simplify-geojson -t 0.001 > ../../../dist/assets/tracks/0.001/$f
done
