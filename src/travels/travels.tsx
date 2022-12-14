import * as L from 'leaflet';
import * as travelDefs from '../assets/travels.json';
import { default as Travel, TravelType } from './Travel';


const travels = Array.from(travelDefs).map(travelDef => {
  return new Travel(
    travelDef.id,
    travelDef.name,
    new Date(travelDef.startDate),
    new Date(travelDef.endDate),
    travelDef.types.map(TravelType.parse),
    travelDef.color,
    new L.LatLngBounds(travelDef.bounds.min, travelDef.bounds.max),
  );
});
export default travels;
