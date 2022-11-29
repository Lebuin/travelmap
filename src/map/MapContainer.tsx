import * as geojson from 'geojson';
import * as React from 'react';
import { FeatureGroup, GeoJSON, Map as LeafletMap, TileLayer } from 'react-leaflet';
import * as L from 'leaflet';
import LayerPicker from './LayerPicker';
import SelectedTravel from './SelectedTravel';
import tileProviders, { TileProvider } from './tileProviders';
import { default as Travel, TravelType } from './Travel';
import TravelPicker from './TravelPicker';
import travels from './travels';
import ZoomButtons from './ZoomButtons';
import './lib/SmoothWeelZoom';


const MIN_ZOOM_LEVEL: number = 0;
const MAX_ZOOM_LEVEL: number = 21;




interface MapContainerState {
  lat: number;
  lon: number;
  zoomLevel: number;
  tileProvider: TileProvider,
  travels: Array<Travel>,
  selectedTravel: Travel,
}


export default class MapContainer extends React.Component<{}, MapContainerState> {
  private map: LeafletMap;
  private renderer: L.Renderer;
  private travelLayers: FeatureGroup;
  private travelLayer: { [key: string]: FeatureGroup } = {};
  private fitBoundsOptions: L.FitBoundsOptions = { padding: [10, 10] };

  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      lat: 0,
      lon: 0,
      zoomLevel: 10,
      tileProvider: tileProviders[0],
      travels: travels,
      selectedTravel: null,
    };
    this.renderer = L.canvas({
      padding: .3,
      tolerance: 10,
    });
  }

  _bind() {
    this.bindMap = this.bindMap.bind(this);
    this.bindTravelLayers = this.bindTravelLayers.bind(this);
    this.setZoomLevel = this.setZoomLevel.bind(this);
    this.onLeafletZoomLevel = this.onLeafletZoomLevel.bind(this);
    this.setTileProvider = this.setTileProvider.bind(this);
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
  }


  bindMap(map: any) {
    this.map = map;
  }
  bindTravelLayers(layer: any) {
    this.travelLayers = layer;
    this.map.leafletElement.fitBounds(
      this.travelLayers.leafletElement.getBounds(),
      this.fitBoundsOptions,
    );
  }
  bindTravelLayer(travel: Travel, layer: any) {
    this.travelLayer[travel.id] = layer;
  }

  get leaflet(): L.Map {
    return this.map.leafletElement;
  }


  setZoomLevel(zoomLevel: number, updateLeaflet = true) {
    this.setState({
      zoomLevel: zoomLevel,
    });
    if(updateLeaflet) {
      this.leaflet.setZoom(zoomLevel);
    }
  }

  onLeafletZoomLevel(event) {
    this.setZoomLevel(event.target._zoom, false);
  }


  setTileProvider(tileProvider: TileProvider) {
    this.setState({
      tileProvider: tileProvider,
    });
  }



  getTravelStyle(travel: Travel, feature: geojson.Feature) {
    let style: L.PathOptions = {
      color: travel.color,
      opacity: this.state.selectedTravel && this.state.selectedTravel !== travel ? .5 : 1,
    };

    let type: TravelType = travel.types[0];
    if(feature.properties && feature.properties.type) {
      type = TravelType.parse(feature.properties.type);
    }
    if(type === TravelType.HIKING) {
      style.weight = 5;
      style.lineCap = 'butt';
      style.dashArray = '9,6';
    } else if(type === TravelType.BIKING) {
      style.weight = 4;
    } else {
      style.weight = 2;
      style.opacity = .6;
    }

    return style;
  }


  setSelectedTravel(travel?: Travel) {
    this.setState({
      selectedTravel: travel,
    });
    if(travel) {
      setTimeout(() => {
        this.map.leafletElement.invalidateSize();
        this.map.leafletElement.flyToBounds(
          this.travelLayer[travel.id].leafletElement.getBounds(),
          this.fitBoundsOptions,
        );
      });
    }
  }


  public render() {
    return (
      <React.Fragment>
        <LeafletMap
          ref={this.bindMap}
          center={[this.state.lat, this.state.lon]}
          minZoom={MIN_ZOOM_LEVEL}
          maxZoom={MAX_ZOOM_LEVEL}
          zoomSnap={0.1}
          zoomControl={false}
          scrollWheelZoom={false}
          onZoomEnd={this.onLeafletZoomLevel}
          renderer={this.renderer}
        >
          <TileLayer
            attribution={this.state.tileProvider.attribution}
            url={this.state.tileProvider.url}
          />
          <FeatureGroup ref={this.bindTravelLayers}>
            {this.state.travels.map(travel => {
              return (
                <React.Fragment key={travel.id}>
                  <GeoJSON
                    data={travel.data}
                    style={this.getTravelStyle.bind(this, travel)}
                    ref={this.bindTravelLayer.bind(this, travel)}
                    onClick={this.setSelectedTravel.bind(this, travel)}
                    interactive={travel !== this.state.selectedTravel}
                  />
                </React.Fragment>
              );
            })}
          </FeatureGroup>
        </LeafletMap>

        <SelectedTravel
          travel={this.state.selectedTravel}
          setSelectedTravel={this.setSelectedTravel}
        ></SelectedTravel>

        <div className="picker-btns">
          <LayerPicker
            tileProvider={this.state.tileProvider}
            setTileProvider={this.setTileProvider}
          />

          <TravelPicker
            travels={this.state.travels}
            selectedTravel={this.state.selectedTravel}
            setSelectedTravel={this.setSelectedTravel}
          />
        </div>

        <ZoomButtons
          zoomLevel={this.state.zoomLevel}
          minZoomLevel={MIN_ZOOM_LEVEL}
          maxZoomLevel={MAX_ZOOM_LEVEL}
          onZoomLevelChange={this.setZoomLevel}
        />
      </React.Fragment>
    );
  }
}
