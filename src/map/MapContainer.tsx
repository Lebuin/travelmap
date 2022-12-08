import * as geojson from 'geojson';
import * as L from 'leaflet';
import * as React from 'react';
import { FeatureGroup, Map as LeafletMap, TileLayer } from 'react-leaflet';
import LayerPicker from './LayerPicker';
import './lib/SmoothWeelZoom';
import SelectedTravel from './SelectedTravel';
import tileProviders, { TileProvider } from './tileProviders';
import { default as Travel, TravelType } from './Travel';
import TravelLayer from './TravelLayer';
import TravelPicker from './TravelPicker';
import travels from './travels';
import ZoomButtons from './ZoomButtons';


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
  private refMap: LeafletMap;
  private renderer: L.Renderer;
  private refTravelLayerGroup: FeatureGroup;
  private refsTravelLayer: { [key: string]: TravelLayer } = {};
  private fitBoundsOptions: L.FitBoundsOptions = { padding: [30, 30] };

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
    this.refMap = map;
  }
  bindTravelLayers(layer: any) {
    this.refTravelLayerGroup = layer;
    this.refMap.leafletElement.setView([48, 5], 5);
    const bounds = new L.LatLngBounds(
      { lat: 36.7, lng: -9.0 },
      { lat: 58.2, lng: 23.7 },
    )
    // TODO: reinstate this when we have simplified tracks
    // const bounds = this.refTravelLayerGroup.leafletElement.getBounds()
    this.refMap.leafletElement.fitBounds(bounds, this.fitBoundsOptions);
  }
  bindTravelLayer(travel: Travel, layer: any) {
    this.refsTravelLayer[travel.id] = layer;
  }

  get leaflet(): L.Map {
    return this.refMap.leafletElement;
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



  setSelectedTravel(travel?: Travel) {
    this.setState({
      selectedTravel: travel,
    });
    if(travel) {
      setTimeout(() => {
        this.refMap.leafletElement.invalidateSize();
        this.refMap.leafletElement.flyToBounds(
          this.refsTravelLayer[travel.id].getBounds(),
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
                <TravelLayer
                  key={travel.id}
                  ref={this.bindTravelLayer.bind(this, travel)}

                  travel={travel}
                  zoomLevel={this.state.zoomLevel}
                  isInViewport={true}
                  isSelected={travel === this.state.selectedTravel}
                  isUnfocused={this.state.selectedTravel != null && travel != this.state.selectedTravel}
                  setSelectedTravel={this.setSelectedTravel}
                />
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
