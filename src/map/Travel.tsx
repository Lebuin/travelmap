import * as React from 'react';
import togpx from 'togpx';
import { format } from 'util';
import { FeatureCollection, LineString } from 'geojson';


const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];


export class TravelType {
  public static BIKING = new TravelType('BIKING', 'fa-biking');
  public static HIKING = new TravelType('HIKING', 'fa-shoe-prints');

  readonly name: string;
  readonly icon: string;

  private constructor(name: string, icon: string) {
    this.name = name;
    this.icon = icon;
  }
};



export default class Travel {
  readonly id: string;
  readonly name: string;
  readonly start: Date;
  readonly end: Date;
  readonly color: string;
  readonly types: Array<TravelType>;
  readonly data: FeatureCollection<LineString>;

  constructor(
    id: string,
    name: string,
    color: string,
    start: Date,
    end: Date,
    types: Array<TravelType>,
    data: FeatureCollection<LineString>,
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.start = start;
    this.end = end;
    this.types = [...types];
    this.data = data;
  }


  download() {
    let data = togpx(this.data);
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
