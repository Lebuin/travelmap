import * as React from 'react';
import materialColors from 'material-colors';
import * as traveldata from './traveldata';
import togpx from 'togpx';
import { format } from 'util';
import { GeoJsonObject } from 'geojson';

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



export class Travel {
  readonly id: string;
  readonly name: string;
  readonly start: Date;
  readonly end: Date;
  readonly color: string;
  readonly types: Array<TravelType>;
  readonly data: GeoJsonObject;

  constructor(
    id: string,
    name: string,
    color: string,
    start: Date,
    end: Date,
    types: Array<TravelType>,
    data: GeoJsonObject,
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

export const travels: Array<Travel> = [
  new Travel(
    'torknoeter',
    'Torgny – Knokke',
    materialColors.red['600'],
    new Date(2010, 4, 11),
    new Date(2010, 4, 16),
    [TravelType.BIKING],
    traveldata.torknoeter,
  ),
  new Travel(
    'kopenhagen',
    'Kopenhagen',
    materialColors.purple['600'],
    new Date(2012, 9, 3),
    new Date(2012, 4, 21),
    [TravelType.BIKING],
    traveldata.kopenhagen,
  ),
  new Travel(
    'marseille',
    'Marseille',
    materialColors.yellow['600'],
    new Date(2013, 4, 1),
    new Date(2013, 4, 9),
    [TravelType.BIKING],
    traveldata.marseille,
  ),
  new Travel(
    'venetie',
    'Venetië',
    materialColors.teal['600'],
    new Date(2013, 8, 26),
    new Date(2013, 9, 13),
    [TravelType.BIKING],
    traveldata.venetie,
  ),
  new Travel(
    'italie-balkan',
    'Italië & Balkan',
    materialColors.pink['600'],
    new Date(2014, 2, 10),
    new Date(2014, 8, 10),
    [TravelType.BIKING],
    traveldata.italieBalkan,
  ),
  new Travel(
    'rome',
    'Basel – Rome',
    materialColors.lightGreen['600'],
    new Date(2015, 4, 3),
    new Date(2015, 4, 20),
    [TravelType.BIKING],
    traveldata.rome,
  ),
  new Travel(
    'schotland',
    'Schotland',
    materialColors.deepOrange['600'],
    new Date(2016, 6, 2),
    new Date(2016, 6, 20),
    [TravelType.BIKING],
    traveldata.schotland,
  ),
  new Travel(
    'roemenie',
    'Roemenië',
    materialColors.cyan['600'],
    new Date(2017, 8, 12),
    new Date(2017, 9, 2),
    [TravelType.BIKING],
    traveldata.roemenie,
  ),
  new Travel(
    'portugal',
    'Portugal',
    materialColors.orange['600'],
    new Date(2018, 5, 25),
    new Date(2018, 6, 16),
    [TravelType.HIKING],
    traveldata.portugal,
  ),
  new Travel(
    'pyreneeen',
    'Pyreneeën',
    materialColors.blue['600'],
    new Date(2018, 9, 13),
    new Date(2018, 9, 22),
    [TravelType.HIKING],
    traveldata.pyreneeen,
  ),
  new Travel(
    'noord-spanje',
    'Noord-Spanje',
    materialColors.indigo['600'],
    new Date(2019, 6, 13),
    new Date(2019, 7, 8),
    [TravelType.BIKING, TravelType.HIKING],
    traveldata.noordSpanje,
  ),
  new Travel(
    'mercantour',
    'Mercantour',
    materialColors.brown['600'],
    new Date(2019, 8, 6),
    new Date(2019, 8, 13),
    [TravelType.HIKING],
    traveldata.mercantour,
  ),
];
