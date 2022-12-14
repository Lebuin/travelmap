cd src/assets/tracks

mkdir -p ../../../dist/assets/tracks/0
mkdir -p ../../../dist/assets/tracks/0.01
mkdir -p ../../../dist/assets/tracks/0.001

for f in *.json; do
  cp $f ../../../dist/assets/tracks/0/$f
  cat $f | npx simplify-geojson -t 0.01 > ../../../dist/assets/tracks/0.01/$f
  cat $f | npx simplify-geojson -t 0.001 > ../../../dist/assets/tracks/0.001/$f
done
