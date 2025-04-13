import Swipeable from '@/lib/Swipeable';
import { isMobile } from '@/lib/util';
import NextImage from 'next/image';
import * as React from 'react';
import {
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineClose,
} from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon';
import Image from './Image';

interface SlideshowProps {
  image: Image;
  setSelectedImage(image: Image | undefined): void;
}

interface SlideshowState {
  showNavigation: boolean;
}

export default class Slideshow extends React.Component<
  SlideshowProps,
  SlideshowState
> {
  private hideNavigationTimeout: number = 0;
  private nodeRefs: React.RefObject<HTMLDivElement | null>[];

  constructor(props: SlideshowProps) {
    super(props);
    this._bind();

    this.state = {
      showNavigation: false,
    };

    this.nodeRefs = [React.createRef(), React.createRef(), React.createRef()];
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
    if (isMobile()) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    if (isMobile()) {
      document.exitFullscreen();
    }
  }

  onMouseMove() {
    this.showNavigation();
    clearTimeout(this.hideNavigationTimeout);
    this.hideNavigationTimeout = window.setTimeout(this.hideNavigation, 3000);
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
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
    this.props.setSelectedImage(undefined);
  }

  previous() {
    const image = this.props.image;
    const images = image.travel.images;
    const i = images.indexOf(image);
    if (i > 0) {
      this.props.setSelectedImage(images[i - 1]);
    }
  }

  next() {
    const image = this.props.image;
    const images = image.travel.images;
    const i = images.indexOf(image);
    if (i < images.length - 1) {
      this.props.setSelectedImage(images[i + 1]);
    }
  }

  render() {
    let image = null;
    if (this.props.image) {
      image = (
        <NextImage
          className="slideshow__img"
          src={this.props.image.url}
          alt=""
          unoptimized
        />
      );
    }

    return (
      <Swipeable
        onSwipedLeft={this.next}
        onSwipedRight={this.previous}
      >
        <CSSTransition
          nodeRef={this.nodeRefs[0]}
          appear={true}
          in={!!this.props.image}
          timeout={{
            enter: 500,
            exit: 300,
          }}
          classNames="animate"
        >
          <div
            ref={this.nodeRefs[0]}
            className="slideshow"
            onMouseMove={this.onMouseMove}
          >
            <div className="slideshow__exit">
              <div
                className="btn btn--round btn--dark btn--slideshow"
                onClick={this.exit}
              >
                <Icon icon={MdOutlineClose} />
              </div>
            </div>

            <CSSTransition
              nodeRef={this.nodeRefs[1]}
              in={!!this.state.showNavigation}
              timeout={{
                enter: 300,
                exit: 300,
              }}
              classNames="animate"
            >
              <div
                ref={this.nodeRefs[1]}
                className="slideshow__nav slideshow__nav--prev"
              >
                <div
                  className="btn btn--round btn--dark btn--slideshow"
                  onClick={this.previous}
                >
                  <Icon icon={MdOutlineChevronLeft} />
                </div>
              </div>
            </CSSTransition>

            <CSSTransition
              nodeRef={this.nodeRefs[2]}
              in={!!this.state.showNavigation}
              timeout={{
                enter: 300,
                exit: 300,
              }}
              classNames="animate"
            >
              <div
                ref={this.nodeRefs[2]}
                className="slideshow__nav slideshow__nav--next"
              >
                <div
                  className="btn btn--round btn--dark btn--slideshow"
                  onClick={this.next}
                >
                  <Icon icon={MdOutlineChevronRight} />
                </div>
              </div>
            </CSSTransition>

            {image}
          </div>
        </CSSTransition>
      </Swipeable>
    );
  }
}
