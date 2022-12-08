import * as geolib from 'geolib';
import memoize from 'memoize-one';
import * as React from 'react';
import { format } from 'util';
import Travel, { TravelData, TravelSegment } from './Travel';


interface ElevationMapProps {
  travel: Travel,
};

interface ElevationMapState {
  width: number,
  height: number,
  data: TravelData,
};

export default class ElevationMap extends React.Component<ElevationMapProps, ElevationMapState> {
  constructor(props: ElevationMapProps) {
    super(props);
    this._bind();

    this.state = {
      width: 0,
      height: 0,
      data: null,
    };
  }

  _bind() {
    this.bindElem = this.bindElem.bind(this);
  }

  componentDidUpdate(prevProps: ElevationMapProps) {
    if(this.props.travel !== prevProps.travel) {
      this.setState({
        data: null,
      });
      this.props.travel.getData().then(data => {
        this.setState({
          data: data,
        });
      })
    }
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
    let path: JSX.Element = this.renderPath(
      this.props.travel,
      this.state.data,
      this.state.width,
      this.state.height,
    );

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


  renderPath = memoize((travel: Travel, data: TravelData, width: number, height: number) => {
    if(data == null || width <= 0 || height <= 0) {
      return null;
    }

    let heightCoordinates = [];
    let distance = 0;
    let minHeight = 0;
    let maxHeight = -Infinity;
    data.features.forEach((feature: TravelSegment) => {
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
