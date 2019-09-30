import * as React from 'react';
import materialColors from 'material-colors';
import * as kml from './kml';
import { format } from 'util';

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
  public static HIKING = new TravelType('BIKING', 'fa-shoe-prints');

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
  readonly url: string;

  constructor(
    id: string,
    name: string,
    color: string,
    start: Date,
    end: Date,
    types: Array<TravelType>,
    url: string,
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.start = start;
    this.end = end;
    this.types = [...types];
    this.url = url;
  }


  renderIcon() {
    if(this.types.length === 1 && this.types[0] === TravelType.BIKING) {
      return <i className="far fa-biking"></i>;
    } else if(this.types.length === 1 && this.types[0] === TravelType.HIKING) {
      return <i className="far fa-hiking"></i>;
    } else {
      return (
        <React.Fragment>
          <i className="far fa-biking"       style={{ fontSize: '85%', transform: 'translate( 12%,  13%)' }}></i>
          <i className="far fa-hiking muted" style={{ fontSize: '85%', transform: 'translate(-12%, -13%)' }}></i>
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
    kml.torknoeter,
  ),
  new Travel(
    'kopenhagen',
    'Kopenhagen',
    materialColors.purple['600'],
    new Date(2012, 9, 3),
    new Date(2012, 4, 21),
    [TravelType.BIKING],
    kml.kopenhagen,
  ),
  new Travel(
    'marseille',
    'Marseille',
    materialColors.yellow['600'],
    new Date(2013, 4, 1),
    new Date(2013, 4, 9),
    [TravelType.BIKING],
    kml.marseille,
  ),
  new Travel(
    'venetie',
    'Venetië',
    materialColors.teal['600'],
    new Date(2013, 8, 26),
    new Date(2013, 9, 13),
    [TravelType.BIKING],
    kml.venetie,
  ),
  new Travel(
    'italie-balkan',
    'Italië & Balkan',
    materialColors.pink['600'],
    new Date(2014, 2, 10),
    new Date(2014, 8, 10),
    [TravelType.BIKING],
    kml.italieBalkan,
  ),
  new Travel(
    'rome',
    'Basel – Rome',
    materialColors.lightGreen['600'],
    new Date(2015, 4, 3),
    new Date(2015, 4, 20),
    [TravelType.BIKING],
    kml.rome,
  ),
  new Travel(
    'schotland',
    'Schotland',
    materialColors.deepOrange['600'],
    new Date(2016, 6, 2),
    new Date(2016, 6, 20),
    [TravelType.BIKING],
    kml.schotland,
  ),
  new Travel(
    'roemenie',
    'Roemenië',
    materialColors.cyan['600'],
    new Date(2017, 8, 12),
    new Date(2017, 9, 2),
    [TravelType.BIKING],
    kml.roemenie,
  ),
  new Travel(
    'portugal',
    'Portugal',
    materialColors.orange['600'],
    new Date(2018, 5, 25),
    new Date(2018, 6, 16),
    [TravelType.HIKING],
    kml.portugal,
  ),
  new Travel(
    'pyreneeen',
    'Pyreneeën',
    materialColors.blue['600'],
    new Date(2018, 9, 13),
    new Date(2018, 9, 22),
    [TravelType.HIKING],
    kml.pyreneeen,
  ),
  new Travel(
    'noord-spanje',
    'Noord-Spanje',
    materialColors.indigo['600'],
    new Date(2019, 6, 13),
    new Date(2019, 7, 8),
    [TravelType.BIKING, TravelType.HIKING],
    kml.noordSpanje,
  ),
  new Travel(
    'mercantour',
    'Mercantour',
    materialColors.brown['600'],
    new Date(2019, 8, 6),
    new Date(2019, 8, 13),
    [TravelType.BIKING],
    kml.mercantour,
  ),
];
