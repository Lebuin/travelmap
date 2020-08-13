import * as React from 'react';
import Travel from './Travel';
import { FeatureCollection, Feature, LineString, Position } from 'geojson';
import * as geolib from 'geolib';
import { format } from 'util';
import materialColors from 'material-colors';
import memoize from 'memoize-one';


interface ElevationMapProps {
  travel: Travel,
};

interface ElevationMapState {
  width: number,
  height: number,
};

export default class ElevationMap extends React.Component<ElevationMapProps, ElevationMapState> {
  constructor(props: ElevationMapProps) {
    super(props);
    this._bind();

    this.state = {
      width: 0,
      height: 0,
    };
  }

  _bind() {
    this.bindElem = this.bindElem.bind(this);
  }


  bindElem(elem: any) {
    if(elem) {
      this.setState({
        width: elem.clientWidth,
        height: elem.clientHeight,
      });
    } else {
      this.setState({
        width: 0,
        height: 0,
      });
    }
  }


  render() {
    let path: JSX.Element = this.renderPath(this.props.travel, this.state.width, this.state.height);

    let viewBox = format('0 0 %s %s', this.state.width, this.state.height);

    return (
      <div
        className="selected-travel__elevation-map-wrapper"
        ref={this.bindElem}
      >
        <svg
          viewBox={viewBox}
          className="selected-travel__elevation-map"
          preserveAspectRatio="none"
        >
          {path}
        </svg>
      </div>
    )
  }


  renderPath = memoize((travel: Travel, width: number, height: number) => {
    if(width <= 0 || height <= 0) {
      return null;
    }

    let featureCollection: FeatureCollection<LineString> = this.props.travel.data;
    let heightCoordinates = [];
    let distance = 0;
    let minHeight = 0;
    let maxHeight = -Infinity;
    featureCollection.features.forEach((feature: Feature<LineString>) => {
      let coordinates = feature.geometry.coordinates;
      for(let i = 0; i < coordinates.length; i++) {
        let coordinate = coordinates[i];
        if(i > 0) {
          let prevCoordinate = coordinates[i - 1];
          distance += geolib.getDistance(
            [prevCoordinate[0], prevCoordinate[1]],
            [coordinate[0], coordinate[1]],
          );
        }

        let height = coordinate[2];
        heightCoordinates.push([distance, height]);
        minHeight = Math.max(0, Math.min(minHeight, height));
        maxHeight = Math.max(maxHeight, height);
      }
    });


    let path = 'M' + heightCoordinates
      .map(coordinate => format(
        '%s,%s',
        coordinate[0] / distance * width,
        (coordinate[1] - maxHeight) / (minHeight - maxHeight) * height
      ))
      .join('L')
      + format('V%sH0z', height)

    return (
      <path
        d={path}
        fill={travel.color}
        opacity="0.2"
      />
    );
  });
}
