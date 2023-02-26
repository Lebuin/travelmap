const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

const PATH_TRAVEL_DEFS = 'src/assets/travels.csv';
const BASE_FOLDER_IMAGES_SRC_LOCAL = '/home/seppe/Pictures';
const BASE_FOLDER_IMAGES_SRC_REMOTE = '/run/user/1000/gvfs/sftp:host=home.pi,user=pi/media/pi/BACKUP/pictures';
const BASE_FOLDER_IMAGES_DEST = 'src/assets/images';

const IMAGE_SIZE = 2000;
const IMAGE_QUALITY = 90;


function readTravelDefs(path) {
  const content = fs.readFileSync(path);
  const travelDefs = parse(content, {
    columns: true,
    skipEmptyLines: true,
  });
  return travelDefs;
}


function getSrcFolder(travelDef) {
  const baseFolder = travelDef.imageFolderIsLocal === '1' ?
    BASE_FOLDER_IMAGES_SRC_LOCAL :
    BASE_FOLDER_IMAGES_SRC_REMOTE;
  const folder = path.join(baseFolder, travelDef.imageFolder);
  return folder;
}

function getDestFolder(travelDef) {
  const folder = path.join(BASE_FOLDER_IMAGES_DEST, travelDef.id);
  return folder;
}


function exportJpegImages(srcFolder, destFolder) {
  const pattern = path.join(srcFolder, '*.jpg');
  console.log(pattern);
  const files = glob.sync(pattern, { nocase: true});
  files.forEach(file => {
    console.log(file);
    const command = `mogrify -path '${destFolder}' -thumbnail ${IMAGE_SIZE}x${IMAGE_SIZE} -quality ${IMAGE_QUALITY} '${file}'`;
    execSync(command);
  });
}


function exportRawImages(srcFolder, destFolder) {
  const command = `darktable-cli '${srcFolder}' '${destFolder}' --width ${IMAGE_SIZE} --height ${IMAGE_SIZE} --core --conf plugins/imageio/format/jpeg/quality=${IMAGE_QUALITY}`;
  execSync(command);
}


function exportImages(travelDef) {
  const srcFolder = getSrcFolder(travelDef);
  const destFolder = getDestFolder(travelDef);
  const isJpeg = travelDef.isJpeg === '1';
  if(fs.existsSync(destFolder)) {
    return;
  }

  console.log(travelDef.id);
  fs.mkdirSync(destFolder, { recursive: true });
  if(isJpeg) {
    exportJpegImages(srcFolder, destFolder);
  } else {
    exportRawImages(srcFolder, destFolder);
  }
}


function main() {
  const travelDefs = readTravelDefs(PATH_TRAVEL_DEFS);
  travelDefs
    .filter(travelDef => travelDef.imageFolder)
    .forEach(exportImages);
}

main();
