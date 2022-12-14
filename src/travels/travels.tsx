import * as L from 'leaflet';
import * as travelDefs from '../assets/travels.json';
import * as allImageDefs from '../assets/images.json';
import Travel, { TravelType } from './Travel';
import Image from '../slideshow/Image';


const travels = Array.from(travelDefs).map(travelDef => {
  const imageDefs = allImageDefs[travelDef.id] || [];
  const images = Array.from(imageDefs).map((imageDef: any) => {
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
  });
  console.log(travelDef.id, images.length);

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
