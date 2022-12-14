import * as L from 'leaflet';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { FeatureGroup, Map as LeafletMap, TileLayer, Viewport } from 'react-leaflet';
import LayerPicker from './LayerPicker';
import './lib/SmoothWeelZoom';
import SelectedTravel from './SelectedTravel';
import tileProviders, { TileProvider } from './tileProviders';
import { default as Travel } from './Travel';
import TravelLayer from './TravelLayer';
import TravelPicker from './TravelPicker';
import travels from './travels';
import ZoomButtons from './ZoomButtons';
import debounce from './lib/debounce';


const MIN_ZOOM_LEVEL: number = 0;
const MAX_ZOOM_LEVEL: number = 21;




interface MapContainerState {
  zoomLevel: number,
  center: [number, number] | null | undefined,
  tileProvider: TileProvider,
  travels: Array<Travel>,
  selectedTravel: Travel,
}


export default class MapContainer extends React.Component<{}, MapContainerState> {
  private refMap: LeafletMap;
  private renderer: L.Renderer;
  private refsTravelLayer: { [key: string]: TravelLayer } = {};
  private fitBoundsOptions: L.FitBoundsOptions = { padding: [30, 30] };

  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      zoomLevel: 10,
      center: null,
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
    this.setZoomLevel = this.setZoomLevel.bind(this);
    this.onLeafletViewportChange = this.onLeafletViewportChange.bind(this);
    this.setTileProvider = this.setTileProvider.bind(this);
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
  }


  bindMap(map: any) {
    this.refMap = map;
  }
  bindTravelLayer(travel: Travel, layer: any) {
    this.refsTravelLayer[travel.id] = layer;
  }

  get leaflet(): L.Map | undefined {
    return this.refMap?.leafletElement;
  }


  setZoomLevel(zoomLevel: number, updateLeaflet = true) {
    this.setState({
      zoomLevel: zoomLevel,
    });
    if(updateLeaflet) {
      this.leaflet.setZoom(zoomLevel);
    }
  }

  setViewport(viewport: Viewport) {
    this.setState({
      zoomLevel: viewport.zoom,
      center: viewport.center,
    });
  }
  setViewportDebounced = debounce(this.setViewport, 500);


  onLeafletViewportChange(viewport) {
    this.setViewportDebounced(viewport);
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
          travel.bounds,
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
          bounds={this.getBounds(this.state.travels)}
          minZoom={MIN_ZOOM_LEVEL}
          maxZoom={MAX_ZOOM_LEVEL}
          zoomSnap={0.1}
          zoomControl={false}
          scrollWheelZoom={false}
          onViewportChange={this.onLeafletViewportChange}
          // onZoomEnd={this.onLeafletZoomLevel}
          renderer={this.renderer}
        >
          <TileLayer
            attribution={this.state.tileProvider.attribution}
            url={this.state.tileProvider.url}
          />
          <FeatureGroup>
            {this.state.travels.map(travel => {
              return (
                <TravelLayer
                  key={travel.id}
                  ref={this.bindTravelLayer.bind(this, travel)}

                  travel={travel}
                  zoomLevel={this.state.zoomLevel}
                  isInViewport={this.isInViewport(travel)}
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


  private getBounds = memoizeOne((travels: Travel[]) => {
    let bounds = new L.LatLngBounds(
      travels[0].bounds.getSouthWest(),
      travels[0].bounds.getNorthEast(),
    );
    travels.forEach(travel => {
      bounds.extend(travel.bounds);
    });
    return bounds;
  });


  private isInViewport(travel: Travel) {
    return !!(this.leaflet && this.leaflet.getBounds().intersects(travel.bounds));
  }
}
