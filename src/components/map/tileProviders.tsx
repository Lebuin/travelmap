const OSM_ATTRIBUTION: string =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const MAPBOX_ATTRIBUTION: string =
  '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export interface TileProvider {
  name: string;
  url: string;
  attribution?: string;
}

const tileProviders: Array<TileProvider> = [
  {
    name: 'Mapbox',
    url:
      'https://a.tiles.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=' +
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    attribution: [OSM_ATTRIBUTION, MAPBOX_ATTRIBUTION].join(' '),
  },
  {
    name: 'Open Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTRIBUTION,
  },
  {
    name: 'ESRI Topographic',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  },
  {
    name: 'ESRI World Imagery',
    url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
];
export default tileProviders;
