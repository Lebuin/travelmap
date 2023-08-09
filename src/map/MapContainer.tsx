import * as L from 'leaflet';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { FeatureGroup, Map as LeafletMap, Marker, TileLayer, Viewport } from 'react-leaflet';
import Image from '../slideshow/Image';
import debounce from '../lib/debounce';
import '../lib/SmoothWeelZoom';
import { default as Travel } from '../travels/Travel';
import LayerPicker from './LayerPicker';
import SelectedTravel from './SelectedTravel';
import tileProviders, { TileProvider } from './tileProviders';
import TravelLayer from './TravelLayer';
import TravelPicker from './TravelPicker';
import ZoomButtons from './ZoomButtons';
import stateService from '../stateService';


const MIN_ZOOM_LEVEL: number = 0;
const MAX_ZOOM_LEVEL: number = 21;


interface MapContainerProps {
  travels: Travel[],
  selectedTravel: Travel,
  setSelectedTravel(travel: Travel): any,
  setSelectedImage(image: Image): any,
}

interface MapContainerState {
  zoomLevel: number,
  center: [number, number] | null | undefined,
  tileProvider: TileProvider,
}


export default class MapContainer extends React.Component<MapContainerProps, MapContainerState> {
  private refMap: LeafletMap;
  private renderer: L.Renderer;
  private refsTravelLayer: { [key: string]: TravelLayer } = {};
  private fitBoundsOptions: L.FitBoundsOptions = { padding: [30, 30] };

  constructor(props: MapContainerProps) {
    super(props);
    this._bind();

    this.state = {
      zoomLevel: 0,
      center: null,
      tileProvider: tileProviders[0],
      ...this.popState(),
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
  }


  componentDidUpdate(prevProps: MapContainerProps) {
    if(this.props.selectedTravel && this.props.selectedTravel !== prevProps.selectedTravel) {
      this.flyToTravel(this.props.selectedTravel);
    }
  }



  private pushState() {
    const locationParts = [
      this.state.center[0].toFixed(5),
      this.state.center[1].toFixed(5),
      this.state.zoomLevel.toFixed(2),
    ]
    const l = locationParts.join(',');
    stateService.set('l', l);
  }

  private popState() {
    const l = stateService.get('l');
    if(l != null) {
      const locationParts = l.split(',');
      const center: [number, number] = [
        parseFloat(locationParts[0]),
        parseFloat(locationParts[1]),
      ];
      const zoomLevel = parseFloat(locationParts[2]);
      if(!Number.isNaN(center[0]) && !Number.isNaN(center[1]) && !Number.isNaN(zoomLevel)) {
        return {
          zoomLevel: zoomLevel,
          center: center,
        };
      }
    }

    return {}
  }



  bindMap(map: any) {
    this.refMap = map;
    // We need to re-render to correctly set isInViewport
    this.setState({});
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
    this.pushState();
  }
  setViewportDebounced = debounce(this.setViewport, 100);


  onLeafletViewportChange(viewport) {
    this.setViewportDebounced(viewport);
  }


  setTileProvider(tileProvider: TileProvider) {
    this.setState({
      tileProvider: tileProvider,
    });
  }



  flyToTravel(travel?: Travel) {
    setTimeout(() => {
      this.refMap.leafletElement.invalidateSize();
      this.refMap.leafletElement.flyToBounds(
        travel.bounds,
        this.fitBoundsOptions,
      );
    });
  }


  public render() {
    let viewport = null, bounds = null;
    if(this.state.center && this.state.zoomLevel) {
      viewport = {
        center: this.state.center,
        zoom: this.state.zoomLevel,
      };
    } else {
      bounds = this.getBounds(this.props.travels);
    }

    return (
      <React.Fragment>
        <LeafletMap
          ref={this.bindMap}
          bounds={bounds}
          boundsOptions={this.fitBoundsOptions}
          viewport={viewport}
          minZoom={MIN_ZOOM_LEVEL}
          maxZoom={MAX_ZOOM_LEVEL}
          zoomSnap={0.01}
          zoomControl={false}
          scrollWheelZoom={false}
          onViewportChange={this.onLeafletViewportChange}
          renderer={this.renderer}
        >
          <TileLayer
            key={this.state.tileProvider.url}
            attribution={this.state.tileProvider.attribution}
            url={this.state.tileProvider.url}
          />

          {this.renderImages(this.props.selectedTravel, this.state.zoomLevel)}

          <FeatureGroup>
            {this.props.travels.map(travel => {
              return (
                <TravelLayer
                  key={travel.id}
                  ref={this.bindTravelLayer.bind(this, travel)}

                  travel={travel}
                  zoomLevel={this.state.zoomLevel}
                  isInViewport={this.isInViewport(travel)}
                  isSelected={travel === this.props.selectedTravel}
                  isUnfocused={this.props.selectedTravel != null && travel != this.props.selectedTravel}
                  setSelectedTravel={this.props.setSelectedTravel}
                />
              );
            })}
          </FeatureGroup>
        </LeafletMap>

        <SelectedTravel
          travel={this.props.selectedTravel}
          setSelectedTravel={this.props.setSelectedTravel}
          setSelectedImage={this.props.setSelectedImage}
        ></SelectedTravel>

        <div className="picker-btns">
          <LayerPicker
            tileProvider={this.state.tileProvider}
            setTileProvider={this.setTileProvider}
          />

          <TravelPicker
            travels={this.props.travels}
            selectedTravel={this.props.selectedTravel}
            setSelectedTravel={this.props.setSelectedTravel}
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


  private renderImages = memoizeOne((travel: Travel, zoomLevel: number) => {
    if(!travel) {
      return null;
    }

    return (
      <FeatureGroup>
        {travel.images
          .filter(image => image.location)
          .map(image => {
            return (
              <Marker
                key={image.thumbnailUrl}
                position={image.location}
                icon={new L.Icon({
                  iconUrl: image.thumbnailUrl,
                  iconSize: this.getImageSize(image, zoomLevel),
                  className: 'image-marker',
                })}
                riseOnHover={true}
                onclick={this.props.setSelectedImage.bind(this, image)}
              />
            );
          })
        }
      </FeatureGroup>
    );
  });

  private getImageSize(image: Image, zoomLevel: number): [number, number] {
    const area = Math.min(Math.max(Math.pow(2, 1.5 * zoomLevel) * .1, 1000), 10000);
    // const aspectRatio = image.aspectRatio;
    const aspectRatio = 1;
    let height = Math.sqrt(area / aspectRatio);
    let width = height * aspectRatio;
    return [width, height];
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
