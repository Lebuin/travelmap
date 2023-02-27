import * as L from 'leaflet';
import Travel from '../travels/Travel';


export default class Image {
  private _travel: Travel;
  readonly filename: string;
  readonly dateCreated: Date;
  readonly width: number;
  readonly height: number;
  readonly location: L.LatLng;

  constructor(
    filename: string,
    dateCreated: Date,
    width: number,
    height: number,
    location: L.LatLng,
  ) {
    this.filename = filename;
    this.dateCreated = dateCreated;
    this.width = width;
    this.height = height;
    this.location = location;
  }


  set travel(travel: Travel) {
    if(this._travel != null) {
      throw Error('travel is already set');
    }
    this._travel = travel;
  }
  get travel() {
    return this._travel;
  }

  get aspectRatio() {
    return this.width / this.height;
  }


  get url() {
    return `/assets/images/full/${this.travel.id}/${this.filename}`;
  }
  get thumbnailUrl() {
    return `/assets/images/thumb/${this.travel.id}/${this.filename}`;
  }
}
