import './app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Image from './slideshow/Image';
import { MapContainer } from './map';
import Slideshow from './slideshow/Slideshow';
import Travel from './travels/Travel';
import travels from './travels/travels';
import stateService from './stateService';


interface AppState {
  travels: Travel[],
  selectedTravel: Travel,
  selectedImage: Image,
}


class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      travels: travels,
      ...this.popState(),
    };
  }

  _bind() {
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
    this.setSelectedImage = this.setSelectedImage.bind(this);
  }


  popState() {
    const state = {
      selectedTravel: null as Travel,
      selectedImage: null as Image,
    };

    const travelId = stateService.get('travel');
    if(travelId) {
      state.selectedTravel = travels.find(travel => travel.id === travelId);
    }

    const imageFilename = stateService.get('image');
    if(imageFilename && state.selectedTravel) {
      state.selectedImage = state.selectedTravel.images
        .find(image => image.filename === imageFilename);
    }

    return state;
  }


  setSelectedTravel(travel: Travel) {
    this.setState({
      selectedTravel: travel,
    });
    stateService.set('travel', travel?.id);
  }

  setSelectedImage(image: Image) {
    this.setState({
      selectedImage: image,
    });
    stateService.set('image', image?.filename);
  }


  public render() {
    return (
      <React.Fragment>
        <MapContainer
          travels={this.state.travels}
          selectedTravel={this.state.selectedTravel}
          setSelectedTravel={this.setSelectedTravel}
          setSelectedImage={this.setSelectedImage}
        />

        <Slideshow
          image={this.state.selectedImage}
          setSelectedImage={this.setSelectedImage}
        />
      </React.Fragment>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
