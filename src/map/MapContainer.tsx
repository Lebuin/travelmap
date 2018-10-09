import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import * as React from 'react';


const MAPBOX_ACCESS_TOKEN: string =
  'pk.eyJ1IjoibGVidWluIiwiYSI6ImNpcG90ZGRsODAwMmZoem5iejVieGNrdjkifQ.vb73zLJdMoc8WiyYLk4SCg';
const OSM_ATTRIBUTION: string = '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const MAPBOX_ATTRIBUTION: string =
  '&amp;copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>' + ' ' + OSM_ATTRIBUTION;


enum TileProvider {
  MapboxStreets,
}

interface TileProviderInfo {
  name: string;
  url: string;
  attribution: string;
}

const tileProviders = new Map<number, TileProviderInfo>([
  [
    TileProvider.MapboxStreets,
    {
      name: 'Mapbox',
      url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + MAPBOX_ACCESS_TOKEN,
      attribution: MAPBOX_ATTRIBUTION,
    },
  ],
]);


interface MapContainerState {
  lat: number;
  lon: number;
  zoom: number;
}


export class MapContainer extends React.Component<any, MapContainerState> {
  private tileProvider: TileProvider;

  constructor(properties) {
    super(properties);

    this.tileProvider = TileProvider.MapboxStreets;
    this.state = {
      lat: 50.6,
      lon: 4.3,
      zoom: 9,
    };
  }


  public render() {
    const tileProviderInfo: TileProviderInfo = tileProviders.get(this.tileProvider);

    return (
      <LeafletMap center={[this.state.lat, this.state.lon]} zoom={this.state.zoom}>
        <TileLayer
          attribution={tileProviderInfo.attribution}
          url={tileProviderInfo.url}
        />
      </LeafletMap>
    );
  }
}
