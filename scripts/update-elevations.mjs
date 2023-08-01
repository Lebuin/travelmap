#!/usr/bin/env node

import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs/promises';
import { GOOGLE_API_KEY } from './secrets.mjs';
import _ from 'lodash';

const BATCH_SIZE = 512;
const BATCH_COST = .005;


await main();


async function main() {
  const path = process.argv[2];
  if(!path) {
    console.error('Usage: update-elevations.js <path>');
    process.exit(1);
  }

  await updateElevations(path);
}


async function updateElevations(path) {
  const travel = await readTravel(path);
  const coordinates = getAllCoordinates(travel);
  const elevations = await getElevations(coordinates);
  updateTravel(travel, elevations);
  await writeTravel(travel, path);
}


async function readTravel(path) {
  const content = await fs.readFile(path, 'utf8');
  const travel = JSON.parse(content.toString());
  return travel;
}

async function writeTravel(travel, path) {
  const content = serializeJson(travel);
  await fs.writeFile(path, content, 'utf8');
}

function serializeJson(travel) {
  let data = JSON.stringify(travel, null, 2);
  data = data.replace(/^\s+\[\n\s+([\d.-]+),\n\s+([\d.-]+),\s+([\d.-]+)\n\s+\],/gm, '[$1,$2,$3],');
  return data;
}


function getAllCoordinates(travel) {
  const coordinates = travel.features
    .map(feature => {
      const geometry = feature.geometry;
      const coordinates = geometry.coordinates;
      return coordinates;
    })
    .flat(1)
    .map(coordinate => {
      const [lng, lat] = coordinate;
      return { lat, lng };
    });
  return coordinates;
}



function getKey(coordinate) {
  const { lat, lng } = coordinate;
  return `${lat},${lng}`;
}


async function getElevations(coordinates) {
  const elevations = {};
  const client = new Client({});
  const batches = _.chunk(coordinates, BATCH_SIZE);

  const totalCost = batches.length * BATCH_COST;
  console.log(`Number of Google Elevation API calls: ${batches.length}, estimated cost: $${totalCost.toFixed(2)}`);

  for(const batch of batches) {
    const response = await client.elevation({
      params: {
        key: GOOGLE_API_KEY,
        locations: batch,
      },
    });
    const results = response.data.results;
    for(let i = 0; i < batch.length; i++) {
      const coordinate = batch[i];
      const key = getKey(coordinate);
      const elevation = results[i].elevation;
      elevations[key] = elevation;
    }
  }

  return elevations;
}


function updateTravel(travel, elevations) {
  travel.features.forEach(feature => {
    feature.geometry.coordinates.forEach(coordinate => {
      const [lng, lat] = coordinate;
      const key = getKey({ lat, lng });
      const elevation = _.round(elevations[key], 1);
      if(elevation == null) {
        throw new Error(`Missing elevation for ${coordinate}`);
      }
      coordinate[2] = elevation;
    });
  });
}
