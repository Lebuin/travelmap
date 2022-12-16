import './app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Image from './slideshow/Image';
import { MapContainer } from './map';
import Slideshow from './slideshow/Slideshow';
import Travel from './travels/Travel';
import travels from './travels/travels';


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
      selectedTravel: null,
      selectedImage: null,
    };
  }

  _bind() {
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
    this.setSelectedImage = this.setSelectedImage.bind(this);
  }


  setSelectedTravel(travel: Travel) {
    this.setState({
      selectedTravel: travel,
    });
  }

  setSelectedImage(image: Image) {
    this.setState({
      selectedImage: image,
    });
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
