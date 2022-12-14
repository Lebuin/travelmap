import * as geojson from 'geojson';
import memoize from 'memoize-one';
import * as React from 'react';
import togpx from 'togpx';
import { format } from 'util';
import * as L from 'leaflet';
import Image from '../slideshow/Image';



const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];


export class TravelType {
  public static BIKING = new TravelType('biking', 'fa-biking');
  public static HIKING = new TravelType('hiking', 'fa-shoe-prints');

  public static TRAIN = new TravelType('train', '');
  public static BUS = new TravelType('bus', '');
  public static FERRY = new TravelType('ferry', '');
  public static HITCHHIKING = new TravelType('hitchhiking', '');
  public static UNKNOWN = new TravelType('unknown', '');

  readonly name: string;
  readonly icon: string;

  private constructor(name: string, icon: string) {
    this.name = name;
    this.icon = icon;
  }

  static parse(s: string): TravelType {
    switch(s) {
      case 'biking':
        return TravelType.BIKING;
      case 'hiking':
        return TravelType.HIKING;
      case 'train':
        return TravelType.TRAIN;
      case 'bus':
        return TravelType.BUS;
      case 'ferry':
        return TravelType.FERRY;
      case 'hitchhiking':
        return TravelType.HITCHHIKING;
      default:
        return TravelType.UNKNOWN;
    }
  }
};


export type TravelData = geojson.FeatureCollection<geojson.LineString>;
export type TravelSegment = geojson.Feature<geojson.LineString>;


export default class Travel {
  readonly id: string;
  readonly name: string;
  readonly start: Date;
  readonly end: Date;
  readonly types: TravelType[];
  readonly color: string;
  readonly bounds: L.LatLngBounds;
  readonly images: ReadonlyArray<Image>;

  private _data: { [key: number]: TravelData } = {};

  constructor(
    id: string,
    name: string,
    start: Date,
    end: Date,
    types: Array<TravelType>,
    color: string,
    bounds: L.LatLngBounds,
    images: ReadonlyArray<Image>,
  ) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = end;
    this.types = [...types];
    this.color = color;
    this.bounds = bounds;
    this.images = images;

    for(const image of images) {
      image.travel = this;
    }
  }


  hasData(accuracy = 0) {
    return !!this._data[accuracy];
  }

  async getData(accuracy = 0) {
    if(this.hasData(accuracy)) {
      return this._data[accuracy];
    } else {
      return this._fetchData(accuracy);
    }
  }

  _fetchData = memoize(async (accuracy = 0) => {
    const path = `/assets/tracks/${accuracy}/${this.id}.json`;
    const response = await fetch(path);
    const data = await response.json();
    this._data[accuracy] = data;
    return data;
  })



  download() {
    let jsonData = this.getData();
    let data = togpx(jsonData);
    let filename = this.name + '.gpx';
    let mimetype = 'application/gpx+xml';

    var blob = new Blob([data], { type: mimetype });

    let elem = document.createElement('a');
    elem.href = URL.createObjectURL(blob);
    elem.download = filename;

    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }


  renderIcon() {
    if(this.types.length === 1 && this.types[0] === TravelType.BIKING) {
      return <i className="far fa-biking"></i>;
    } else if(this.types.length === 1 && this.types[0] === TravelType.HIKING) {
      return <i className="far fa-hiking"></i>;
    } else {
      return (
        <React.Fragment>
          <i className="far fa-biking"                style={{ fontSize: '85%', transform: 'translate( 12%,  13%)' }}></i>
          <i className="far fa-hiking secondary-icon" style={{ fontSize: '85%', transform: 'translate(-12%, -13%)' }}></i>
        </React.Fragment>
      );
    }
  }

  renderDateRange() {
    return format(
      '%s %s%s – %s %s %s',
      this.start.getDate(),
      MONTHS[this.start.getMonth()],
      this.start.getFullYear() === this.end.getFullYear() ? '' : ' ' + this.start.getFullYear(),
      this.end.getDate(),
      MONTHS[this.end.getMonth()],
      this.end.getFullYear(),
    );
  }
}
