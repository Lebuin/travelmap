#!/usr/bin/env node

const { parse } = require('csv-parse/sync');
const fs = require('fs');
const materialColors = require('material-colors');


const PATH_TRAVEL_DEFS = 'src/assets/travels.csv';
const PATH_TRAVELS = 'src/assets/travels.json';
const PATH_TRACK = 'src/assets/tracks/{id}.json';


function readTravelDefs(path) {
  const content = fs.readFileSync(path);
  const travelDefs = parse(content, {
    columns: true,
    skipEmptyLines: true,
  });
  return travelDefs;
}

function writeTravels(travels, path) {
  const data = JSON.stringify(travels);
  fs.writeFileSync(path, data);
}


function parseTravels(travelDefs) {
  const travels = travelDefs.map(travelDef => {
    const id = travelDef.id;
    const types = travelDef.types.split(',');
    const colorDef = travelDef.color.split('.');
    const color = materialColors[colorDef[0]][colorDef[1]];

    const bounds = getBounds(id);

    return {
      id: id,
      name: travelDef.name,
      startDate: travelDef.startDate,
      endDate: travelDef.endDate,
      types: types,
      color: color,
      bounds: bounds,
    };
  });
  return travels;
}


function getBounds(travelId) {
  const path = PATH_TRACK.replace('{id}', travelId);
  const data = fs.readFileSync(path).toString();
  const track = JSON.parse(data);
  const bounds = {
    min: {
      lat: 90,
      lng: 180,
    },
    max: {
      lat: -90,
      lng: -180,
    },
  };

  track.features.forEach(segment => {
    segment.geometry.coordinates.forEach(([lng, lat]) => {
      bounds.min.lat = Math.min(bounds.min.lat, lat);
      bounds.min.lng = Math.min(bounds.min.lng, lng);
      bounds.max.lat = Math.max(bounds.max.lat, lat);
      bounds.max.lng = Math.max(bounds.max.lng, lng);
    });
  });

  return bounds;
}


function main() {
  const travelDefs = readTravelDefs(PATH_TRAVEL_DEFS);
  const travels = parseTravels(travelDefs);
  writeTravels(travels, PATH_TRAVELS);
}

main();
