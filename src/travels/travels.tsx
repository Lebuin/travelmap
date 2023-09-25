import * as L from 'leaflet';
import * as travelDefs from '../assets/travels.json';
import * as allImageDefs from '../assets/images.json';
import Travel, { TravelType } from './Travel';
import Image from '../slideshow/Image';


// We mark images taken within 10 seconds of each other as panoramas.
const PANORAMA_THRESHOLD = 10 * 1000;


function createImageFromDef(imageDef: any) {
  const location = imageDef.lat == null || imageDef.lng == null ?
    null :
    new L.LatLng(imageDef.lat, imageDef.lng);
  return new Image(
    imageDef.filename,
    new Date(imageDef.dateCreated),
    imageDef.width,
    imageDef.height,
    location,
  );
}


const travels = Array.from(travelDefs).map(travelDef => {
  const imageDefs = allImageDefs[travelDef.id] || [];
  const images = Array.from(imageDefs).map(createImageFromDef);

  return new Travel(
    travelDef.id,
    travelDef.name,
    new Date(travelDef.startDate),
    new Date(travelDef.endDate),
    travelDef.types.map(TravelType.parse),
    travelDef.color,
    new L.LatLngBounds(travelDef.bounds.min, travelDef.bounds.max),
    images,
  );
});
export default travels;
