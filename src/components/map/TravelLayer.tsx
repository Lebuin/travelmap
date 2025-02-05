import Travel, { TravelData, TravelType } from '@/components/travels/Travel';
import * as L from 'leaflet';
import * as React from 'react';
import { GeoJSON } from 'react-leaflet';

interface TravelLayerProps {
  travel: Travel;
  zoomLevel: number;
  isInViewport: boolean;
  isSelected: boolean;
  isUnfocused: boolean;
  setSelectedTravel(travel?: Travel): void;
}

interface TravelLayerState {
  travel: Travel;
  accuracy: number;
  data?: TravelData;
}

const MAX_TOLERANCE_IN_PIXELS = 2;
const TRACK_ACCURACIES_IN_DEGREES = [0, 0.001, 0.01];

export default class TravelLayer extends React.Component<
  TravelLayerProps,
  TravelLayerState
> {
  private layer?: L.GeoJSON;

  constructor(props: TravelLayerProps) {
    super(props);
    this._bind();

    this.state = {
      travel: this.props.travel,
      accuracy: -1,
      data: undefined,
    };
  }

  _bind() {
    this.getStyle = this.getStyle.bind(this);
    this.bindLayer = this.bindLayer.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  private fetchData() {
    const accuracy = this.getAccuracy(
      this.props.isInViewport,
      this.props.zoomLevel,
    );
    if (accuracy !== this.state.accuracy) {
      this.props.travel.getData(accuracy).then((data) => {
        this.setState({
          accuracy: accuracy,
          data: data,
        });
      });
    }
  }

  render() {
    if (this.state.data == null) {
      return null;
    }

    return (
      <GeoJSON
        key={this.state.accuracy}
        data={this.state.data}
        style={this.getStyle}
        ref={this.bindLayer}
        eventHandlers={{
          click: () => this.props.setSelectedTravel(this.state.travel),
        }}
        interactive={!this.props.isSelected}
      />
    );
  }

  bindLayer(layer: L.GeoJSON) {
    this.layer = layer;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStyle(segment: any) {
    const style: L.PathOptions = {
      color: this.state.travel.color,
      opacity: this.props.isUnfocused ? 0.5 : 1,
    };

    let type: TravelType = this.state.travel.types[0];
    if (segment.properties?.type) {
      type = TravelType.parse(segment.properties.type);
    }
    if (type === TravelType.HIKING) {
      style.weight = 5;
      style.lineCap = 'butt';
      style.dashArray = '9,6';
    } else if (type === TravelType.BIKING) {
      style.weight = 4;
    } else {
      style.weight = 2;
      style.opacity = 0.6;
    }

    return style;
  }

  getBounds() {
    return this.layer?.getBounds();
  }

  getAccuracy(isInViewport: boolean, zoomLevel: number): number {
    if (!isInViewport) {
      return TRACK_ACCURACIES_IN_DEGREES[
        TRACK_ACCURACIES_IN_DEGREES.length - 1
      ];
    }

    const pixelSizeInDegrees = this.getPixelSizeInDegrees(zoomLevel);
    const desiredAccuracy = MAX_TOLERANCE_IN_PIXELS * pixelSizeInDegrees;
    const accuracy = TRACK_ACCURACIES_IN_DEGREES.slice()
      .reverse()
      .find((accuracy) => accuracy < desiredAccuracy);
    if (accuracy == null) {
      throw new Error('No accuracy found');
    }
    return accuracy;
  }

  getPixelSizeInDegrees(zoomLevel: number) {
    const earthWidthPixels = 256 * Math.pow(2, zoomLevel);
    const earthWidthDegrees = 360;
    return earthWidthDegrees / earthWidthPixels;
  }
}
