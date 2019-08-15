import * as React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import ZoomButtons from './ZoomButtons';


const MAPBOX_ACCESS_TOKEN: string =
  'pk.eyJ1IjoibGVidWluIiwiYSI6ImNpcG90ZGRsODAwMmZoem5iejVieGNrdjkifQ.vb73zLJdMoc8WiyYLk4SCg';
const OSM_ATTRIBUTION: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const MAPBOX_ATTRIBUTION: string =
  '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>' + ' ' + OSM_ATTRIBUTION;
const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 21;


enum TileProvider {
  MapboxStreets,
}

interface TileProviderInfo {
  name: string;
  url: string;
  attribution: string;
}

const tileProviders = new Map<TileProvider, TileProviderInfo>([
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
  zoomLevel: number;
}


export default class MapContainer extends React.Component<{}, MapContainerState> {
  private tileProvider: TileProvider;

  constructor(props: {}) {
    super(props);
    this._bind();

    this.tileProvider = TileProvider.MapboxStreets;
    this.state = {
      lat: 50.6,
      lon: 4.3,
      zoomLevel: 9,
    };
  }

  _bind() {
    this.setZoomLevel = this.setZoomLevel.bind(this);
    this.onLeafletZoomLevel = this.onLeafletZoomLevel.bind(this);
  }


  setZoomLevel(zoomLevel) {
    this.setState({
      zoomLevel: zoomLevel,
    });
  }

  onLeafletZoomLevel(event) {
    this.setZoomLevel(event.target._zoom);
  }


  public render() {
    const tileProviderInfo: TileProviderInfo = tileProviders.get(this.tileProvider);

    return (
      <React.Fragment>
        <LeafletMap
          center={[this.state.lat, this.state.lon]}
          zoom={this.state.zoomLevel}
          minZoom={MIN_ZOOM_LEVEL}
          maxZoom={MAX_ZOOM_LEVEL}
          zoomControl={false}
          onZoomEnd={this.onLeafletZoomLevel}
        >
          <TileLayer
            attribution={tileProviderInfo.attribution}
            url={tileProviderInfo.url}
          />
        </LeafletMap>
        <ZoomButtons
          zoomLevel={this.state.zoomLevel}
          minZoomLevel={MIN_ZOOM_LEVEL}
          maxZoomLevel={MAX_ZOOM_LEVEL}
          onZoomLevelChange={this.setZoomLevel}
        ></ZoomButtons>
      </React.Fragment>
    );
  }
}
