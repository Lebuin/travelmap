#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { parse } = require('csv-parse/sync');
const { execFileSync } = require('child_process');

const PATH_TRAVEL_DEFS = 'src/assets/travels.csv';
const BASE_FOLDER_IMAGES_SRC_LOCAL = '/home/seppe/Pictures';
const BASE_FOLDER_IMAGES_SRC_REMOTE = '/run/user/1000/gvfs/sftp:host=home.pi,user=pi/media/pi/BACKUP/pictures';
const BASE_FOLDER_IMAGES_DEST = 'src/assets/images';

const IMAGE_SIZE = 2000;
const IMAGE_QUALITY = 90;


function main() {
  const travelDefs = readTravelDefs(PATH_TRAVEL_DEFS);
  const travelIds = process.argv.length > 2 ?
    process.argv.slice(2) :
    travelDefs.map(travelDef => travelDef.id);
  travelDefs
    .filter(travelDef => travelIds.includes(travelDef.id))
    .filter(travelDef => travelDef.imageFolder)
    .forEach(exportImages);
}


function readTravelDefs(path) {
  const content = fs.readFileSync(path);
  const travelDefs = parse(content, {
    columns: true,
    skipEmptyLines: true,
  });
  return travelDefs;
}


function exportImages(travelDef) {
  console.log(travelDef.id);

  const srcFolder = getSrcFolder(travelDef);
  const destFolder = getDestFolder(travelDef);

  const destFolderTmp = destFolder + '_tmp';
  if(fs.existsSync(destFolderTmp)) {
    fs.rmSync(destFolderTmp, { recursive: true });
  }
  fs.mkdirSync(destFolderTmp);

  exportDarktable(srcFolder, destFolderTmp);
  stitchPanoramas(srcFolder, destFolderTmp);
  scaleImages(destFolderTmp);

  if(fs.existsSync(destFolder)) {
    fs.rmSync(destFolder, { recursive: true });
  }
  fs.renameSync(destFolderTmp, destFolder);
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



function exportDarktable(srcFolder, destFolder) {
  const xmpFiles = glob.sync(`${srcFolder}/*.xmp`);
  xmpFiles.forEach(xmpFile => {
    const xmpContent = fs.readFileSync(xmpFile, 'utf8');

    const outputName = path.basename(xmpFile).replace(/\..+$/, '');
    const imageFile = xmpContent.match(/xmpMM:DerivedFrom="([^"]*)"/)[1];
    const rejected = xmpContent.match(/xmp:Rating="-1"/) != null;

    if(!rejected) {
      execFileSync('darktable-cli', [
        `${srcFolder}/${imageFile}`,
        xmpFile,
        `${destFolder}/${outputName}.jpg`,
        '--core',
        '--conf', `plugins/imageio/format/jpeg/quality=${IMAGE_QUALITY}`,
      ]);
    }
  });
}


function stitchPanoramas(srcFolder, destFolder) {
  const srcPtoFiles = findPtoFiles(srcFolder);
  const destPtoFiles = copyPtoFiles(srcPtoFiles, destFolder);

  execFileSync('hugin-batch', destPtoFiles);

  destPtoFiles.forEach(destPtoFile => {
    const folder = destPtoFile.replace(/\.pto$/, '');
    fs.rmSync(destPtoFile);
    fs.rmSync(folder, { recursive: true });
  });
}


function scaleImages(folder) {
  glob.sync(`${folder}/*.jpg`).forEach(file => {
    execFileSync('vipsthumbnail', [
      file,
      '--size', `${IMAGE_SIZE}x${IMAGE_SIZE}`,
      '-o', 'tmp.jpg'
    ]);
    fs.renameSync(`${folder}/tmp.jpg`, file);
  });
}


function findPtoFiles(folder) {
  const pattern = `${folder}*/*.pto`;
  return glob.sync(pattern);
}

function copyPtoFiles(srcPtoFiles, destFolder) {
  const destPtoFiles = srcPtoFiles.map(srcPtoFile => {
    const destPtoFile = path.join(destFolder, path.basename(srcPtoFile));
    fs.copyFileSync(srcPtoFile, destPtoFile);
    return destPtoFile;
  });
  return destPtoFiles;
}


main();
