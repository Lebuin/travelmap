import * as React from 'react';
import { FeatureGroup, GeoJSON } from 'react-leaflet';
import Travel, { TravelData, TravelSegment, TravelType } from '../travels/Travel';


interface TravelLayerProps {
  travel: Travel,
  zoomLevel: number,
  isInViewport: boolean
  isSelected: boolean,
  isUnfocused: boolean,
  setSelectedTravel(travel?: Travel): any,
};

interface TravelLayerState {
  travel: Travel,
  accuracy: number,
  data: TravelData,
}

const MAX_TOLERANCE_IN_PIXELS = 2;
const TRACK_ACCURACIES_IN_DEGREES = [0, .001, .01];


export default class TravelLayer extends React.Component<TravelLayerProps, TravelLayerState> {
  private layer: FeatureGroup;

  constructor(props: TravelLayerProps) {
    super(props);
    this._bind();

    this.state = {
      travel: this.props.travel,
      accuracy: 0,
      data: null,
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
    let accuracy = this.getAccuracy(this.props.isInViewport, this.props.zoomLevel);
    if(accuracy !== this.state.accuracy) {
      this.props.travel.getData(accuracy).then(data => {
        this.setState({
          accuracy: accuracy,
          data: data,
        });
      })
    }
  }


  render() {
    if(this.state.data == null) {
      return (null);
    }

    return (
      <GeoJSON
        key={this.state.accuracy}
        data={this.state.data}
        style={this.getStyle}
        ref={this.bindLayer}
        onClick={() => this.props.setSelectedTravel(this.state.travel)}
        interactive={!this.props.isSelected}
      />
    )
  }


  bindLayer(layer: any) {
    this.layer = layer;
  }


  getStyle(segment: TravelSegment) {
    let style: L.PathOptions = {
      color: this.state.travel.color,
      opacity: this.props.isUnfocused ? .5 : 1,
    };

    let type: TravelType = this.state.travel.types[0];
    if(segment.properties?.type) {
      type = TravelType.parse(segment.properties.type);
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


  getBounds() {
    return this.layer.leafletElement.getBounds();
  }


  getAccuracy(isInViewport: boolean, zoomLevel: number) {
    if(!isInViewport) {
      return TRACK_ACCURACIES_IN_DEGREES[TRACK_ACCURACIES_IN_DEGREES.length - 1];
    }

    let pixelSizeInDegrees = this.getPixelSizeInDegrees(zoomLevel);
    let desiredAccuracy = MAX_TOLERANCE_IN_PIXELS * pixelSizeInDegrees;
    return TRACK_ACCURACIES_IN_DEGREES
      .slice()
      .reverse()
      .find(accuracy => accuracy < desiredAccuracy);
  }

  getPixelSizeInDegrees(zoomLevel: number) {
    let earthWidthPixels = 256 * Math.pow(2, zoomLevel);
    let earthWidthDegrees = 360;
    return earthWidthDegrees / earthWidthPixels;
  }
}
