import Image from '@/components/slideshow/Image';
import { default as Travel } from '@/components/travels/Travel';
import debounce from '@/lib/debounce';
import '@/lib/SmoothWeelZoom';
import stateService from '@/lib/stateService';
import * as L from 'leaflet';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import {
  FeatureGroup,
  MapContainer as LeafletMapContainer,
  Marker,
  TileLayer,
} from 'react-leaflet';
import { MapRef } from 'react-leaflet/MapContainer';
import LayerPicker from './LayerPicker';
import SelectedTravel from './SelectedTravel';
import tileProviders, { TileProvider } from './tileProviders';
import TravelLayer from './TravelLayer';
import TravelPicker from './TravelPicker';
import ZoomButtons from './ZoomButtons';

const MIN_ZOOM_LEVEL: number = 0;
const MAX_ZOOM_LEVEL: number = 21;

interface MapContainerProps {
  travels: Travel[];
  selectedTravel: Travel | undefined;
  setSelectedTravel(travel: Travel): any;
  setSelectedImage(image: Image): any;
}

interface MapContainerState {
  zoomLevel: number;
  center: [number, number] | null | undefined;
  tileProvider: TileProvider;
}

export default class MapContainer extends React.Component<
  MapContainerProps,
  MapContainerState
> {
  private refMap?: MapRef;
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
      padding: 0.3,
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
    if (
      this.props.selectedTravel &&
      this.props.selectedTravel !== prevProps.selectedTravel
    ) {
      this.flyToTravel(this.props.selectedTravel);
    }
  }

  private pushState(center: [number, number], zoomLevel: number) {
    const locationParts = [
      center[0].toFixed(5),
      center[1].toFixed(5),
      zoomLevel.toFixed(2),
    ];
    const l = locationParts.join(',');
    stateService.set('l', l);
  }

  private popState() {
    const l = stateService.get('l');
    if (l != null) {
      const locationParts = l.split(',');
      const center: [number, number] = [
        parseFloat(locationParts[0]),
        parseFloat(locationParts[1]),
      ];
      const zoomLevel = parseFloat(locationParts[2]);
      if (
        !Number.isNaN(center[0]) &&
        !Number.isNaN(center[1]) &&
        !Number.isNaN(zoomLevel)
      ) {
        return {
          zoomLevel: zoomLevel,
          center: center,
        };
      }
    }

    return {};
  }

  bindMap(map: MapRef) {
    if(this.refMap) {
      this.refMap?.off('load', this.onLeafletViewportChange);
      this.refMap?.off('zoomend', this.onLeafletViewportChange);
      this.refMap?.off('moveend', this.onLeafletViewportChange);
    }
    this.refMap = map;
    if(this.refMap) {
      this.refMap.on('load', this.onLeafletViewportChange);
      this.refMap.on('zoomend', this.onLeafletViewportChange);
      this.refMap.on('moveend', this.onLeafletViewportChange);
      this.onLeafletViewportChange();
    }
    // We need to re-render to correctly set isInViewport
    this.setState({});
  }
  bindTravelLayer(travel: Travel, layer: any) {
    this.refsTravelLayer[travel.id] = layer;
  }

  get leaflet(): L.Map | undefined {
    return this.refMap ?? undefined;
  }

  setZoomLevel(zoomLevel: number, updateLeaflet = true) {
    this.setState({
      zoomLevel: zoomLevel,
    });
    if (updateLeaflet) {
      this.leaflet?.setZoom(zoomLevel);
    }
  }

  setViewport(center: [number, number], zoomLevel: number) {
    this.setState({
      zoomLevel,
      center,
    });
    this.pushState(center, zoomLevel);
  }
  setViewportDebounced = debounce(this.setViewport, 100);

  onLeafletViewportChange() {
    if(this.leaflet) {
      const center = this.leaflet.getCenter();
      this.setViewportDebounced([center.lat, center.lng], this.leaflet.getZoom());
    }
  }

  setTileProvider(tileProvider: TileProvider) {
    this.setState({
      tileProvider: tileProvider,
    });
  }

  flyToTravel(travel: Travel) {
    setTimeout(() => {
      this.leaflet?.invalidateSize();
      this.leaflet?.flyToBounds(
        travel.bounds,
        this.fitBoundsOptions
      );
    });
  }

  public render() {
    let viewport;
    let bounds;
    if (this.state.center && this.state.zoomLevel) {
      viewport = {
        center: this.state.center,
        zoom: this.state.zoomLevel,
      };
    } else {
      bounds = this.getBounds(this.props.travels);
    }

    return (
      <React.Fragment>
        <LeafletMapContainer
          ref={this.bindMap}
          bounds={bounds}
          boundsOptions={this.fitBoundsOptions}
          center={viewport?.center}
          zoom={viewport?.zoom}
          minZoom={MIN_ZOOM_LEVEL}
          maxZoom={MAX_ZOOM_LEVEL}
          zoomSnap={0.01}
          zoomControl={false}
          scrollWheelZoom={false}
          renderer={this.renderer}
        >
          <TileLayer
            key={this.state.tileProvider.url}
            attribution={this.state.tileProvider.attribution}
            url={this.state.tileProvider.url}
          />

          {this.props.selectedTravel && this.renderImages(this.props.selectedTravel, this.state.zoomLevel)}

          <FeatureGroup>
            {this.props.travels.map((travel) => {
              return (
                <TravelLayer
                  key={travel.id}
                  ref={this.bindTravelLayer.bind(this, travel)}
                  travel={travel}
                  zoomLevel={this.state.zoomLevel}
                  isInViewport={this.isInViewport(travel)}
                  isSelected={travel === this.props.selectedTravel}
                  isUnfocused={
                    this.props.selectedTravel != null &&
                    travel != this.props.selectedTravel
                  }
                  setSelectedTravel={this.props.setSelectedTravel}
                />
              );
            })}
          </FeatureGroup>
        </LeafletMapContainer>

        {this.props.selectedTravel && <SelectedTravel
          travel={this.props.selectedTravel}
          setSelectedTravel={this.props.setSelectedTravel}
          setSelectedImage={this.props.setSelectedImage}
        ></SelectedTravel>}

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
    return (
      <FeatureGroup>
        {travel.images
          .filter((image) => image.location)
          .map((image) => {
            return (
              <Marker
                key={image.thumbnailUrl}
                position={image.location!}
                icon={
                  new L.Icon({
                    iconUrl: image.thumbnailUrl,
                    iconSize: this.getImageSize(image, zoomLevel),
                    className: 'image-marker',
                  })
                }
                riseOnHover={true}
                eventHandlers={{
                  click: this.props.setSelectedImage.bind(this, image)
                }}
              />
            );
          })}
      </FeatureGroup>
    );
  });

  private getImageSize(image: Image, zoomLevel: number): [number, number] {
    const area = Math.min(
      Math.max(Math.pow(2, 1.5 * zoomLevel) * 0.1, 30 * 30),
      80 * 80
    );
    // const aspectRatio = image.aspectRatio;
    const aspectRatio = 1;
    let height = Math.sqrt(area / aspectRatio);
    let width = height * aspectRatio;
    return [width, height];
  }

  private getBounds = memoizeOne((travels: Travel[]) => {
    let bounds = new L.LatLngBounds(
      travels[0].bounds.getSouthWest(),
      travels[0].bounds.getNorthEast()
    );
    travels.forEach((travel) => {
      bounds.extend(travel.bounds);
    });
    return bounds;
  });

  private isInViewport(travel: Travel) {
    return !!(
      this.leaflet && this.leaflet.getBounds().intersects(travel.bounds)
    );
  }
}
