#!/bin/sh

cd src/assets/images

rm -rf ../../../public/assets/images
mkdir -p ../../../public/assets/images/thumb
ln -s ../../../src/assets/images ../../../public/assets/images/full

for folder in *; do
  rm -rf $folder/thumb
  mkdir -p $folder/thumb
  find $folder -maxdepth 1 -type f -name '*.jpg' -exec vipsthumbnail {} --size 150x150 -o thumb/%s.jpg \;
  mv $folder/thumb ../../../public/assets/images/thumb/$folder
done
