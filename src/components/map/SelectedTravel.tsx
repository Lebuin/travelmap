import Image from '@/components/slideshow/Image';
import Travel from '@/components/travels/Travel';
import * as React from 'react';
import {
  MdOutlineClose,
  MdOutlineDownload,
  MdOutlineImage,
  MdOutlineLocationOn,
} from 'react-icons/md';
import Icon from '../icon';
import ElevationMap from './ElevationMap';

interface SelectedTravelProps {
  travel: Travel;
  setSelectedTravel(travel?: Travel): void;
  setSelectedImage(image: Image): void;
}

export default class SelectedTravel extends React.Component<
  SelectedTravelProps,
  object
> {
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
    if (this.props.travel.images.length > 0) {
      this.props.setSelectedImage(this.props.travel.images[0]);
    }
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
            <div className="selected-travel__name">
              {this.props.travel.name}
            </div>
            <div className="selected-travel__info">
              {this.props.travel.renderDateRange()}
            </div>
          </div>

          {this.props.travel.images.length > 0 && (
            <div
              className="btn btn--round"
              onClick={this.openSlideshow}
            >
              <Icon icon={MdOutlineImage} />
            </div>
          )}
          <div
            className="btn btn--round"
            onClick={this.fitBounds}
          >
            <Icon icon={MdOutlineLocationOn} />
          </div>
          <div
            className="btn btn--round"
            onClick={this.download}
          >
            <Icon icon={MdOutlineDownload} />
          </div>
          <div style={{ flex: 1 }}></div>
          <div
            className="btn btn--round"
            onClick={this.exit}
          >
            <Icon icon={MdOutlineClose} />
          </div>
        </div>
      </div>
    );
  }
}
