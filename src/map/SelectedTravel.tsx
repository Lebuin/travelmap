import * as React from 'react';
import Travel from '../travels/Travel';
import ElevationMap from './ElevationMap';


interface SelectedTravelProps {
  travel: Travel,
  setSelectedTravel(travel?: Travel): any,
  setShowSlideshow(showSlideshow: boolean): any,
};


export default class SelectedTravel extends React.Component<SelectedTravelProps, {}> {
  constructor(props: SelectedTravelProps) {
    super(props);
    this._bind();
  }

  _bind() {
    this.openSlideshow = this.openSlideshow.bind(this);
    this.fitBounds = this.fitBounds.bind(this);
    this.exit = this.exit.bind(this);
    this.download = this.download.bind(this);
  }

  openSlideshow() {
    this.props.setShowSlideshow(true);
  }

  fitBounds() {
    this.props.setSelectedTravel(this.props.travel);
  }

  exit() {
    this.props.setSelectedTravel();
  }

  download() {
    this.props.travel.download();
  }


  render() {
    if(!this.props.travel) {
      return null;
    }

    return (
      <div className="selected-travel">
        <div
          className="selected-travel__border"
          style={{ background: this.props.travel.color }}
        ></div>
        <div className="selected-travel__body">
          <ElevationMap travel={this.props.travel}></ElevationMap>
          <div className="selected-travel__icon">
            {this.props.travel.renderIcon()}
          </div>
          <div className="selected-travel__content">
            <div className="selected-travel__name">{this.props.travel.name}</div>
            <div className="selected-travel__info">
              {this.props.travel.renderDateRange()}
            </div>
          </div>

          <div className="btn btn--round" onClick={this.openSlideshow}>
            <i className="far fa-images"></i>
          </div>
          <div className="btn btn--round" onClick={this.fitBounds}>
            <i className="far fa-map-marked"></i>
          </div>
          <div className="btn btn--round" onClick={this.download}>
            <i className="far fa-arrow-to-bottom"></i>
          </div>
          <div style={{flex: 1}}></div>
          <div className="btn btn--round" onClick={this.exit}>
            <i className="far fa-times"></i>
          </div>
        </div>
      </div>
    )
  }
}
