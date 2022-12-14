import * as React from 'react';
import Travel from '../travels/Travel';


interface SlideshowProps {
  selectedTravel: Travel,
  setShowSlideshow(showSlideshow: boolean): any,
}

interface SlideshowState {}


export default class Slideshow extends React.Component<SlideshowProps, SlideshowState> {
  constructor(props: SlideshowProps) {
    super(props);
    this._bind();
  }

  _bind() {
    this.exit = this.exit.bind(this);
  }


  exit() {
    this.props.setShowSlideshow(false);
  }


  render() {
    if(!this.props.selectedTravel) {
      return null;
    }

    return (
      <div className="slideshow">
        <div className="slideshow__exit">
          <div className="btn btn--round btn--dark btn--slideshow" onClick={this.exit}>
            <i className="far fa-times"></i>
          </div>
        </div>
      </div>
    )
  }
}
