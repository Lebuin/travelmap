#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');


const PATH_TRAVEL_DEFS = 'src/assets/travels.csv';
const PATH_IMAGES = 'src/assets/images.json';
const BASE_FOLDER_IMAGES_SRC_LOCAL = '/home/seppe/Pictures';
const BASE_FOLDER_IMAGES_SRC_REMOTE = '/run/user/1000/gvfs/sftp:host=home.pi,user=pi/media/pi/BACKUP/pictures';


function main() {
  const travelDefs = readTravelDefs(PATH_TRAVEL_DEFS);
  const allImageDefs = JSON.parse(fs.readFileSync(PATH_IMAGES, 'utf-8'));

  Object.keys(allImageDefs).forEach(travelId => {
    const travelDef = travelDefs.find(travelDef => travelDef.id === travelId);
    const imageDefs = allImageDefs[travelId];

    imageDefs
      .filter(imageDef => !isPanorama(imageDef))
      .filter(imageDef => !srcImageExists(travelDef, imageDef))
      .forEach(image => { console.log(`${travelId} - ${image.filename}`); });
  });
}


function readTravelDefs(path) {
  const content = fs.readFileSync(path);
  const travelDefs = parse(content, {
    columns: true,
    skipEmptyLines: true,
  });
  return travelDefs;
}


function isPanorama(imageDef) {
  return !imageDef.filename.match(/^IMG_\d{4}\.jpg$/i);
}


function srcImageExists(travelDef, imageDef) {
  const srcFolder = getSrcFolder(travelDef);
  const srcBasename = imageDef.filename.replace(/\.jpg$/, '');
  const srcPath = path.join(srcFolder, srcBasename);

  const candidateExtensions = ['.jpg', '.JPG', '.CR2'];
  const candidatePaths = candidateExtensions.map(ext => srcPath + ext);

  return candidatePaths.some(candidatePath => fs.existsSync(candidatePath));
}


function getSrcFolder(travelDef) {
  const baseFolder = travelDef.imageFolderIsLocal === '1' ?
    BASE_FOLDER_IMAGES_SRC_LOCAL :
    BASE_FOLDER_IMAGES_SRC_REMOTE;
  const folder = path.join(baseFolder, travelDef.imageFolder);
  return folder;
}


main();
