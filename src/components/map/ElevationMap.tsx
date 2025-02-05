import Travel, {
  TravelData,
  TravelSegment,
  TravelType,
} from '@/components/travels/Travel';
import * as geolib from 'geolib';
import _ from 'lodash';
import memoize from 'memoize-one';
import * as React from 'react';
import { format } from 'util';

interface ElevationMapProps {
  travel: Travel;
}

interface ElevationMapState {
  width: number;
  height: number;
  data: TravelData | null;
}

type Longitude = number;
type Latitude = number;
type Distance = number;
type Elevation = number;
type Coordinate = [Longitude, Latitude];
type PosDist = [Distance, Elevation, Coordinate];
type SegmentInfo = {
  isTravel: boolean;
  posDists: PosDist[];
  distance: Distance;
  minElevation: Elevation;
  maxElevation: Elevation;
};

export default class ElevationMap extends React.Component<
  ElevationMapProps,
  ElevationMapState
> {
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
    this.props.travel.getData().then((data) => {
      this.setState({
        data: data,
      });
    });
  }

  componentDidUpdate(prevProps: ElevationMapProps) {
    if (this.props.travel !== prevProps.travel) {
      this.setState({
        data: null,
      });
      this.props.travel.getData().then((data) => {
        this.setState({
          data: data,
        });
      });
    }
  }

  bindElem(elem: HTMLElement | null) {
    if (elem) {
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
    const path = this.renderShapes(
      this.props.travel,
      this.state.data,
      this.state.width,
      this.state.height,
    );

    const viewBox = format('0 0 %s %s', this.state.width, this.state.height);

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
    );
  }

  renderShapes = memoize(
    (
      travel: Travel,
      data: TravelData | null,
      widthPx: number,
      heightPx: number,
    ) => {
      if (data == null || widthPx <= 0 || heightPx <= 0) {
        return null;
      }
      const segments = data.features as TravelSegment[];
      const segmentInfos = this.getSegmentInfos(segments);

      let minElevation = 0;
      let maxElevation = Math.max(
        ...segmentInfos.map((segmentInfo) => segmentInfo.maxElevation),
      );
      // Give the elevation graph a minimal scale
      maxElevation = Math.max(200, maxElevation);
      // Make sure we have some padding around the graph.
      const paddingBottom = 0.1 * heightPx;
      const paddingTop = 0.1 * heightPx;
      const elevationPerPx =
        (maxElevation - minElevation) / (heightPx - paddingBottom - paddingTop);
      maxElevation += paddingTop * elevationPerPx;
      minElevation -= paddingBottom * elevationPerPx;

      const totalDistance = _.sum(
        segmentInfos.map((segmentInfo) => segmentInfo.distance),
      );

      const shapes = segmentInfos.map((segmentInfo, index) => {
        const posDists = segmentInfo.posDists;
        const posDist = posDists[0];
        const d = [
          format('M%s,%s', (posDist[0] / totalDistance) * widthPx, heightPx),
          format(
            'V%s',
            ((posDist[1] - maxElevation) / (minElevation - maxElevation)) *
              heightPx,
          ),
          ...posDists.map((posDist) =>
            format(
              'L%s,%s',
              (posDist[0] / totalDistance) * widthPx,
              ((posDist[1] - maxElevation) / (minElevation - maxElevation)) *
                heightPx,
            ),
          ),
          format('V%s', heightPx),
          'z',
        ].join('');
        const fill = segmentInfo.isTravel ? travel.color : 'url(#transit)';
        const path = (
          <path
            key={'segment:' + index}
            d={d}
            fill={fill}
            opacity="0.3"
          />
        );
        return path;
      });

      shapes.push(
        <pattern
          key="pattern-transit"
          id="transit"
          patternUnits="userSpaceOnUse"
          width="15"
          height="15"
        >
          <path
            d="M-15,15l30,-30 M0,15l30,-30 M0,30l30,-30"
            stroke={travel.color}
            opacity={0.3}
            strokeWidth={7}
          />
        </pattern>,
      );

      return shapes;
    },
  );

  getSegmentInfos = memoize((segments: TravelSegment[]) => {
    const segmentInfos = segments.map((segment) =>
      this.getSegmentInfo(segment),
    );
    this.cleanTransitSegments(segmentInfos);
    this.scaleTransitSegments(segmentInfos);
    this.removeTransitElevations(segmentInfos);
    this.offsetSegments(segmentInfos);
    return segmentInfos;
  });

  getSegmentInfo(segment: TravelSegment): SegmentInfo {
    let distance: Distance = 0;
    let minElevation: Elevation = Infinity;
    let maxElevation: Elevation = -Infinity;
    const posDists: PosDist[] = [];

    const positions = segment.geometry.coordinates;
    for (let i = 0; i < positions.length; i++) {
      const [lon, lat, rawElevation] = positions[i];
      const elevation = Math.max(0, rawElevation);
      if (i > 0) {
        const [prevLon, prevLat] = positions[i - 1];
        distance += geolib.getDistance([prevLon, prevLat], [lon, lat]);
      }

      posDists.push([distance, elevation, [lon, lat]]);
      minElevation = Math.max(0, Math.min(minElevation, elevation));
      maxElevation = Math.max(maxElevation, elevation);
    }

    return {
      isTravel: this.isTravelSegment(segment),
      posDists: posDists,
      distance: distance,
      minElevation: minElevation,
      maxElevation: maxElevation,
    };
  }

  isTravelSegment(segment: TravelSegment) {
    const typeStr = segment.properties?.type;
    if (typeStr == null) {
      return true;
    } else {
      const type = TravelType.parse(typeStr);
      return type === TravelType.BIKING || type === TravelType.HIKING;
    }
  }

  cleanTransitSegments(segmentInfos: SegmentInfo[]) {
    while (!segmentInfos[0].isTravel) {
      segmentInfos.shift();
    }
    while (!segmentInfos[segmentInfos.length - 1].isTravel) {
      segmentInfos.pop();
    }

    let i = 0;
    while (i < segmentInfos.length - 1) {
      if (!segmentInfos[i].isTravel && !segmentInfos[i + 1].isTravel) {
        this.mergeTransit(segmentInfos[i], segmentInfos[i + 1]);
        segmentInfos.splice(i + 1, 1);
      } else {
        i += 1;
      }
    }
  }

  mergeTransit(segmentInfo1: SegmentInfo, segmentInfo2: SegmentInfo) {
    segmentInfo2.posDists.forEach((posDist) => {
      posDist[0] += segmentInfo1.distance;
    });
    segmentInfo1.posDists = segmentInfo1.posDists.concat(segmentInfo2.posDists);
    segmentInfo1.distance += segmentInfo2.distance;
    segmentInfo1.minElevation = Math.min(
      segmentInfo1.minElevation,
      segmentInfo2.minElevation,
    );
    segmentInfo1.maxElevation = Math.max(
      segmentInfo1.maxElevation,
      segmentInfo2.maxElevation,
    );
  }

  scaleTransitSegments(segmentInfos: SegmentInfo[]) {
    const transitSegmentInfos = segmentInfos.filter(
      (segmentInfo) => !segmentInfo.isTravel,
    );
    const distances = transitSegmentInfos.map(
      (segmentInfo) => segmentInfo.distance,
    );

    // Compress distances, so that the differences between long and short transit segments is not
    // as pronounced
    const compressedDistances = distances.map((distance) =>
      Math.sqrt(distance),
    );

    // Determine the total fraction that transit segments should take up. This depends on the
    // number of transit stops.
    const minFraction = 0.05;
    const maxFraction = 0.3;
    const maxTransitStops = 10;
    const numTransitStops = Math.min(
      transitSegmentInfos.length,
      maxTransitStops,
    );
    const fraction =
      minFraction +
      ((maxFraction - minFraction) * (numTransitStops - 1)) /
        (maxTransitStops - 1);

    // Determine the correct scale so that the transit segments take up the desired fraction.
    const totalCompressedDistance = _.sum(compressedDistances);
    const travelSegmentInfos = segmentInfos.filter(
      (segmentInfo) => segmentInfo.isTravel,
    );
    const totalTravelDistance = _.sum(
      travelSegmentInfos.map((segmentInfo) => segmentInfo.distance),
    );
    const scale = (totalTravelDistance * fraction) / totalCompressedDistance;

    // Rescale the segments
    const scaledDistances = compressedDistances.map(
      (logDistance) => logDistance * scale,
    );
    const scales = scaledDistances.map(
      (scaledDistance, i) => scaledDistance / distances[i],
    );
    transitSegmentInfos.forEach((segmentInfo, i) => {
      segmentInfo.distance *= scales[i];
      segmentInfo.posDists.forEach((posDist) => {
        posDist[0] *= scales[i];
      });
    });
  }

  offsetSegments(segmentInfos: SegmentInfo[]) {
    let offset = 0;
    segmentInfos.forEach((segmentInfo) => {
      segmentInfo.posDists.forEach((posDist) => {
        posDist[0] += offset;
      });
      offset += segmentInfo.distance;
    });
  }

  removeTransitElevations(segmentInfos: SegmentInfo[]) {
    for (let i = 1; i < segmentInfos.length - 1; i++) {
      const segment = segmentInfos[i];
      if (!segment.isTravel) {
        const prevSegment = segmentInfos[i - 1];
        const nextSegment = segmentInfos[i + 1];
        const startElevation =
          prevSegment.posDists[prevSegment.posDists.length - 1][1];
        const endElevation = nextSegment.posDists[0][1];
        segment.posDists.forEach((posDist) => {
          const elevation =
            startElevation +
            ((endElevation - startElevation) * posDist[0]) / segment.distance;
          posDist[1] = elevation;
        });
        segment.minElevation = Math.min(startElevation, endElevation);
        segment.maxElevation = Math.max(startElevation, endElevation);
      }
    }
  }
}
