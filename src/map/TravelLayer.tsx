import * as geojson from 'geojson';
import * as React from 'react';
import { FeatureGroup, GeoJSON, Map as LeafletMap } from 'react-leaflet';
import Travel, { TravelType } from './Travel';


interface TravelLayerProps {
  map: LeafletMap,
  travel: Travel,
  isSelected: boolean,
  isUnfocused: boolean,
  setSelectedTravel(travel?: Travel): any,
};

interface TravelLayerState {
  travel: Travel,
  isLoaded: boolean,
}


export default class TravelLayer extends React.Component<TravelLayerProps, TravelLayerState> {
  private layer: FeatureGroup;

  constructor(props: TravelLayerProps) {
    super(props);
    this._bind();

    this.state = {
      travel: this.props.travel,
      isLoaded: this.props.travel.data != null,
    };

    this.state.travel.ee.on('data', this._onData);
  }

  _bind() {
    this._onData = this._onData.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.bindLayer = this.bindLayer.bind(this);
  }


  _onData() {
    this.setState({
      isLoaded: this.state.travel.data != null,
    });
  }


  render() {
    if(!this.state.isLoaded) {
      return (null);
    }

    return (
      <GeoJSON
        data={this.state.travel.data}
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


  getStyle(feature: geojson.Feature) {
    let style: L.PathOptions = {
      color: this.state.travel.color,
      opacity: this.props.isUnfocused ? .5 : 1,
    };

    let type: TravelType = this.state.travel.types[0];
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


  getBounds() {
    return this.layer.leafletElement.getBounds();
  }
}
