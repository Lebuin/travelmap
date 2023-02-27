import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import Image from './Image';
import Swipeable from '../lib/Swipeable';
import { isMobile } from '../util';


interface SlideshowProps {
  image: Image,
  setSelectedImage(image: Image): any,
}

interface SlideshowState {
  showNavigation: boolean
}


export default class Slideshow extends React.Component<SlideshowProps, SlideshowState> {
  hideNavigationTimeout: number;

  constructor(props: SlideshowProps) {
    super(props);
    this._bind();

    this.state = {
      showNavigation: false,
    };
  }

  _bind() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.showNavigation = this.showNavigation.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
    this.exit = this.exit.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }


  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: SlideshowProps) {
    if(!!this.props.image !== !!prevProps.image && isMobile()) {
      if(this.props.image) {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      } else {
        document.exitFullscreen();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }


  onMouseMove() {
    this.showNavigation();
    clearTimeout(this.hideNavigationTimeout);
    this.hideNavigationTimeout = window.setTimeout(this.hideNavigation, 3000);
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



  showNavigation() {
    this.setState({
      showNavigation: true,
    });
  }
  hideNavigation() {
    this.setState({
      showNavigation: false,
    });
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
    let image = null;
    if(this.props.image) {
      image = (<img className="slideshow__img" src={this.props.image.url} />);
    }


    return (
      <Swipeable
        onSwipedLeft={this.next}
        onSwipedRight={this.previous}
      >
        <CSSTransition
          appear={true}
          in={!!this.props.image}
          timeout={{
            enter: 500,
            exit: 300,
          }}
          classNames="animate"
        >
          <div className="slideshow" onMouseMove={this.onMouseMove}>
            <div className="slideshow__exit">
              <div className="btn btn--round btn--dark btn--slideshow" onClick={this.exit}>
                <i className="far fa-times"></i>
              </div>
            </div>

            <CSSTransition
              in={!!this.state.showNavigation}
              timeout={{
                enter: 300,
                exit: 300,
              }}
              classNames="animate"
            >
              <div className="slideshow__nav slideshow__nav--prev">
                <div className="btn btn--round btn--dark btn--slideshow" onClick={this.previous}>
                  <i className="far fa-chevron-left"></i>
                </div>
              </div>
            </CSSTransition>

            <CSSTransition
              in={!!this.state.showNavigation}
              timeout={{
                enter: 300,
                exit: 300,
              }}
              classNames="animate"
            >
              <div className="slideshow__nav slideshow__nav--next">
                <div className="btn btn--round btn--dark btn--slideshow" onClick={this.next}>
                  <i className="far fa-chevron-right"></i>
                </div>
              </div>
            </CSSTransition>

            {image}
          </div>
        </CSSTransition>
      </Swipeable>
    )
  }
}
