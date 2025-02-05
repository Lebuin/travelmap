'use client';

import stateService from '@/lib/stateService';
import * as React from 'react';
import { MapContainer } from './map';
import Image from './slideshow/Image';
import Slideshow from './slideshow/Slideshow';
import Travel from './travels/Travel';
import travels from './travels/travels';

interface AppState {
  travels: Travel[];
  selectedTravel?: Travel;
  selectedImage?: Image;
}

export default class App extends React.Component<object, AppState> {
  constructor(props: object) {
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
    const state: Partial<AppState> = {
      selectedTravel: undefined,
      selectedImage: undefined,
    };

    const travelId = stateService.get('travel');
    if (travelId) {
      state.selectedTravel = travels.find((travel) => travel.id === travelId);
    }

    const imageFilename = stateService.get('image');
    if (imageFilename && state.selectedTravel) {
      state.selectedImage = state.selectedTravel.images.find(
        (image) => image.filename === imageFilename,
      );
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

        {this.state.selectedImage && (
          <Slideshow
            image={this.state.selectedImage}
            setSelectedImage={this.setSelectedImage}
          />
        )}
      </React.Fragment>
    );
  }
}
