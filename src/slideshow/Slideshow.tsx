import * as React from 'react';
import Image from './Image';


interface SlideshowProps {
  image: Image,
  setSelectedImage(image: Image): any,
}

interface SlideshowState {}


export default class Slideshow extends React.Component<SlideshowProps, SlideshowState> {
  constructor(props: SlideshowProps) {
    super(props);
    this._bind();
  }

  _bind() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.exit = this.exit.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }


  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }


  onKeyDown(event) {
    switch(event.key) {
      case 'Escape':
        return this.exit();
      case 'ArrowLeft':
        return this.previous();
      case 'ArrowRight':
        return this.next();
    }
  }


  exit() {
    this.props.setSelectedImage(null);
  }


  previous() {
    const image = this.props.image;
    const images = image.travel.images;
    const i = images.indexOf(image);
    if(i > 0) {
      this.props.setSelectedImage(images[i - 1]);
    }
  }

  next() {
    const image = this.props.image;
    const images = image.travel.images;
    const i = images.indexOf(image);
    if(i < images.length - 1) {
      this.props.setSelectedImage(images[i + 1]);
    }
  }


  render() {
    if(!this.props.image) {
      return null;
    }

    return (
      <div className="slideshow">
        <div className="slideshow__exit">
          <div className="btn btn--round btn--dark btn--slideshow" onClick={this.exit}>
            <i className="far fa-times"></i>
          </div>
        </div>

        <div className="slideshow__prev">
          <div className="btn btn--round btn--dark btn--slideshow" onClick={this.previous}>
            <i className="far fa-chevron-left"></i>
          </div>
        </div>

        <div className="slideshow__next">
          <div className="btn btn--round btn--dark btn--slideshow" onClick={this.next}>
            <i className="far fa-chevron-right"></i>
          </div>
        </div>

        <img className="slideshow__img" src={this.props.image.url} />
      </div>
    )
  }
}
