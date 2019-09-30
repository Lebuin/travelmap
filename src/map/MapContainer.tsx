import * as React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import ZoomButtons from './ZoomButtons';
import tileProviders, { TileProvider } from './tileProviders';
import LayerPicker from './LayerPicker';
import TravelPicker from './TravelPicker';


const MIN_ZOOM_LEVEL: number = 0;
const MAX_ZOOM_LEVEL: number = 21;




interface MapContainerState {
  lat: number;
  lon: number;
  zoomLevel: number;
  tileProvider: TileProvider,
}


export default class MapContainer extends React.Component<{}, MapContainerState> {
  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      lat: 50.6,
      lon: 4.3,
      zoomLevel: 9,
      tileProvider: tileProviders[0],
    };
  }

  _bind() {
    this.setZoomLevel = this.setZoomLevel.bind(this);
    this.onLeafletZoomLevel = this.onLeafletZoomLevel.bind(this);
    this.setTileProvider = this.setTileProvider.bind(this);
  }


  setZoomLevel(zoomLevel: number) {
    this.setState({
      zoomLevel: zoomLevel,
    });
  }

  onLeafletZoomLevel(event) {
    this.setZoomLevel(event.target._zoom);
  }


  setTileProvider(tileProvider: TileProvider) {
    this.setState({
      tileProvider: tileProvider,
    });
  }


  public render() {
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
            attribution={this.state.tileProvider.attribution}
            url={this.state.tileProvider.url}
          />
        </LeafletMap>

        <div className="picker-btns">
          <LayerPicker
            tileProvider={this.state.tileProvider}
            setTileProvider={this.setTileProvider}
          ></LayerPicker>

          <TravelPicker></TravelPicker>
        </div>

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
