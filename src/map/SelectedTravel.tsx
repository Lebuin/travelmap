import * as React from 'react';
import { Travel } from './travels';


interface SelectedTravelProps {
  selectedTravel: Travel,
  setSelectedTravel(travel?: Travel): any,
};

export default class SelectedTravel extends React.Component<SelectedTravelProps, {}> {
  constructor(props: SelectedTravelProps) {
    super(props);
    this._bind();
  }

  _bind() {
    this.fitBounds = this.fitBounds.bind(this);
    this.exit = this.exit.bind(this);
    this.download = this.download.bind(this);
  }

  fitBounds() {
    this.props.setSelectedTravel(this.props.selectedTravel);
  }

  exit() {
    this.props.setSelectedTravel();
  }

  download() {
    this.props.selectedTravel.download();
  }


  render() {
    if(!this.props.selectedTravel) {
      return null;
    }

    return (
      <div className="selected-travel">
        <div
          className="selected-travel__border"
          style={{ background: this.props.selectedTravel.color }}
        ></div>
        <div className="selected-travel__body">
          <div className="selected-travel__icon">
            {this.props.selectedTravel.renderIcon()}
          </div>
          <div className="selected-travel__content">
            <div className="selected-travel__name">{this.props.selectedTravel.name}</div>
            <div className="selected-travel__info">
              {this.props.selectedTravel.renderDateRange()}
            </div>
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
