cd src/assets/tracks

rm -rf ../../../public/assets/tracks
mkdir -p ../../../public/assets/tracks
mkdir -p ../../../public/assets/tracks/0.01
mkdir -p ../../../public/assets/tracks/0.001
ln -s ../../../src/assets/tracks ../../../public/assets/tracks/0

for f in *.json; do
  echo $f
  cat $f | npx simplify-geojson -t 0.01 > ../../../public/assets/tracks/0.01/$f
  cat $f | npx simplify-geojson -t 0.001 > ../../../public/assets/tracks/0.001/$f
done
