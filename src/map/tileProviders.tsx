const OSM_ATTRIBUTION: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

const MAPBOX_ATTRIBUTION: string = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';
const MAPBOX_ACCESS_TOKEN: string = 'pk.eyJ1IjoibGVidWluIiwiYSI6ImNpcG90ZGRsODAwMmZoem5iejVieGNrdjkifQ.vb73zLJdMoc8WiyYLk4SCg';



export interface TileProvider {
  name: string;
  url: string;
  attribution?: string;
}


const tileProviders: Array<TileProvider> = [
  {
    name: 'Mapbox',
    url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + MAPBOX_ACCESS_TOKEN,
    attribution: [OSM_ATTRIBUTION, MAPBOX_ATTRIBUTION].join(' '),
  },
  {
    name: 'Open Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTRIBUTION,
  },
  {
    name: 'ESRI Topographic',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  },
  {
    name: 'ESRI World Imagery',
    url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
];
export default tileProviders;
