import * as geolib from 'geolib';
import memoize from 'memoize-one';
import * as React from 'react';
import { format } from 'util';
import Travel, { TravelData, TravelSegment, TravelType } from '../travels/Travel';


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

  componentDidMount() {
    this.props.travel.getData().then(data => {
      this.setState({
        data: data,
      });
    });
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
      });
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
    let path = this.renderShapes(
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


  renderShapes = memoize((travel: Travel, data: TravelData, widthPx: number, heightPx: number) => {
    if(data == null || widthPx <= 0 || heightPx <= 0) {
      return null;
    }
    const segments = data.features as TravelSegment[];
    const numTransitStops = this.getNumTransitStops(segments);
    const transitWidthPx = 16;

    let elevations = [[]];
    let distance = 0;
    let minElevation = 0;
    let maxElevation = -Infinity;


    segments.forEach(segment => {
      if(this.isTravelSegment(segment)) {
        const coordinates = segment.geometry.coordinates;
        for(let i = 0; i < coordinates.length; i++) {
          const coordinate = coordinates[i];
          if(i > 0) {
            const prevCoordinate = coordinates[i - 1];
            distance += geolib.getDistance(
              [prevCoordinate[0], prevCoordinate[1]],
              [coordinate[0], coordinate[1]],
            );
          }

          const elevation = coordinate[2];
          elevations[elevations.length - 1].push([distance, elevation]);
          minElevation = Math.max(0, Math.min(minElevation, elevation));
          maxElevation = Math.max(maxElevation, elevation);
        }

      } else if(elevations[elevations.length - 1].length > 0) {
        elevations.push([]);
      }
    });

    if(elevations[elevations.length - 1].length === 0) {
      elevations.pop();
    }
    maxElevation = Math.max(minElevation + 100, maxElevation);

    // Make sure we have around 4px of blank space
    maxElevation += 4 / heightPx * maxElevation;

    const travelShapes = elevations.map((segmentElevations, index) => {
      const dParts = [
        format('M%s,%s', segmentElevations[0][0] / distance * widthPx + index * transitWidthPx, heightPx),
        format('V%s', (segmentElevations[0][1] - maxElevation) / (minElevation - maxElevation) * heightPx),
        ...segmentElevations
          .map(coordinate => format(
            'L%s,%s',
            coordinate[0] / distance * widthPx + index * transitWidthPx,
            (coordinate[1] - maxElevation) / (minElevation - maxElevation) * heightPx
          )),
        format('V%s', heightPx),
        'z'
      ];
      const d = dParts.join('');
      const path = <path
        key={'travel:' + index}
        d={d}
        fill={travel.color}
        opacity="0.3"
      />;
      return path;
    });

    const transitShapes = Array(numTransitStops).fill(null).map((_, index) => {
      const segmentElevations = elevations[index];
      const startDistance = segmentElevations[segmentElevations.length - 1][0];
      const rect = <rect
        key={'transit:' + index}
        x={startDistance / distance * widthPx + index * transitWidthPx}
        y={0}
        width={transitWidthPx}
        height={heightPx}
        opacity={0.3}
        fill="url(#transit)"
      />;
      return rect;
    });

    const pattern = (
      <pattern id="transit" patternUnits="userSpaceOnUse" width="15" height="15">
        <path
          d="M-15,15l30,-30 M0,15l30,-30 M0,30l30,-30"
          stroke={travel.color}
          opacity={0.3}
          strokeWidth={7}
        />
      </pattern>
    );

    const shapes = [pattern, ...travelShapes, ...transitShapes];
    return shapes;
  });


  getNumTransitStops(segments: TravelSegment[]) {
    let numStops = 0;
    let hasSeenTravelSegment = false;
    for(let i = 0; i < segments.length; i++) {
      const isTravelSegment = this.isTravelSegment(segments[i]);
      if(isTravelSegment) {
        const previousIsTravelSegment = i > 0 && this.isTravelSegment(segments[i - 1]);
        if(hasSeenTravelSegment && !previousIsTravelSegment) {
          numStops += 1;
        }
        hasSeenTravelSegment = true;
      }
    }
    return numStops;
  }

  isTravelSegment(segment: TravelSegment) {
    const typeStr = segment.properties?.type;
    if(typeStr == null) {
      return true;
    } else {
      const type = TravelType.parse(typeStr);
      return type === TravelType.BIKING || type === TravelType.HIKING;
    }
  }
}
