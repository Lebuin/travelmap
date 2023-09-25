cd src/assets/images

rm -rf ../../../dist/assets/images
mkdir -p ../../../dist/assets/images/thumb
ln -s ../../../src/assets/images ../../../dist/assets/images/full

for folder in *; do
  rm -rf $folder/thumb
  mkdir -p $folder/thumb
  for f in $(find $folder -type f -name '*.jpg'); do
    vipsthumbnail "$f" --size 100x100 -o thumb/%s.jpg
  done
  mv $folder/thumb ../../../dist/assets/images/thumb/$folder
done
