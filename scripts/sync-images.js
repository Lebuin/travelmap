#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { execFileSync } = require('child_process');

const PATH_TRAVEL_DEFS = 'src/assets/travels.csv';
const ROOT_SRC = 'gdrive-bijgaardehof-crypt:pictures';
const ROOT_DST = 'lendersdev:travelmap/src/assets/images';


function main() {
  const travelDefs = readTravelDefs(PATH_TRAVEL_DEFS);
  travelDefs
    .filter(travelDef => travelDef.imageFolder)
    .forEach(travelDef => exportImages(travelDef, ROOT_SRC, ROOT_DST));
}


function readTravelDefs(path) {
  const content = fs.readFileSync(path);
  const travelDefs = parse(content, {
    columns: true,
    skipEmptyLines: true,
  });
  return travelDefs;
}


function exportImages(travelDef, rootSrc, rootDst) {
  console.log(travelDef.id);

  const folderSrc = path.join(rootSrc, travelDef.imageFolder);
  const folderDst = path.join(rootDst, travelDef.id);

  execFileSync('rclone', [
    'sync',
    `${folderSrc}`,
    `${folderDst}`,
  ]);
}


main();
