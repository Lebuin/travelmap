import * as allImageDefs from '@/assets/images.json';
import * as travelDefs from '@/assets/travels.json';
import * as L from 'leaflet';
import Image from '../slideshow/Image';
import Travel, { TravelType } from './Travel';

interface ImageDef {
  filename: string;
  dateCreated: string;
  width: number;
  height: number;
  lat: number | null;
  lng: number | null;
}

// We mark images taken within 10 seconds of each other as panoramas.
const PANORAMA_THRESHOLD = 10 * 1000;

function createImageFromDef(imageDef: ImageDef) {
  const location =
    imageDef.lat == null || imageDef.lng == null
      ? null
      : new L.LatLng(imageDef.lat, imageDef.lng);
  return new Image(
    imageDef.filename,
    new Date(imageDef.dateCreated),
    imageDef.width,
    imageDef.height,
    location,
  );
}

function printPanoramas(travel: Travel) {
  travel.images.forEach((image, i, array) => {
    const prevImage = array[i - 1];
    const nextImage = array[i + 1];
    const isPanorama =
      (prevImage &&
        image.dateCreated.getTime() - prevImage.dateCreated.getTime() <
          PANORAMA_THRESHOLD) ||
      (nextImage &&
        nextImage.dateCreated.getTime() - image.dateCreated.getTime() <
          PANORAMA_THRESHOLD);
    if (isPanorama) {
      console.log(`Possible panorama: ${travel.id} - ${image.filename}`);
    }
  });
}

function printNonGeotagged(travel: Travel) {
  travel.images.forEach((image) => {
    if (!image.location) {
      console.log(`Non-geotagged image: ${travel.id} - ${image.filename}`);
    }
  });
}

const travels = Array.from(travelDefs).map((travelDef) => {
  const imageDefs = (allImageDefs[travelDef.id as keyof typeof allImageDefs] ??
    []) as ImageDef[];
  const images = Array.from(imageDefs).map(createImageFromDef);

  const travel = new Travel(
    travelDef.id,
    travelDef.name,
    new Date(travelDef.startDate),
    new Date(travelDef.endDate),
    travelDef.types.map(TravelType.parse),
    travelDef.color,
    new L.LatLngBounds(travelDef.bounds.min, travelDef.bounds.max),
    images,
  );

  printPanoramas(travel);
  printNonGeotagged(travel);

  return travel;
});
export default travels;
