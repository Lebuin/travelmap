cd src/assets/images

rm -rf ../../../dist/assets/images
mkdir -p ../../../dist/assets/images/thumb
ln -s ../../../src/assets/images ../../../dist/assets/images/full

for folder in *; do
  rm -rf $folder/thumb
  mkdir -p $folder/thumb
  find $folder -type f -maxdepth 1 -name '*.jpg' -exec vipsthumbnail {} --size 150x150 -o thumb/%s.jpg \;
  mv $folder/thumb ../../../dist/assets/images/thumb/$folder
done
