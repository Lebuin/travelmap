import './app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MapContainer } from './map';
import Slideshow from './slideshow/Slideshow';
import Travel from './travels/Travel';
import travels from './travels/travels';


interface AppState {
  travels: Travel[],
  selectedTravel: Travel,
  showSlideshow: boolean,
}


class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      travels: travels,
      selectedTravel: null,
      showSlideshow: false,
    };
  }

  _bind() {
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
    this.setShowSlideshow = this.setShowSlideshow.bind(this);
  }


  setSelectedTravel(travel: Travel) {
    this.setState({
      selectedTravel: travel,
    });
  }

  setShowSlideshow(showSlideshow: boolean) {
    this.setState({
      showSlideshow: showSlideshow,
    });
  }


  public render() {
    let slideshow = null;
    if(this.state.showSlideshow && this.state.selectedTravel) {
      slideshow = (
        <Slideshow
          selectedTravel={this.state.selectedTravel}
          setShowSlideshow={this.setShowSlideshow}
        />
      );
    }

    return (
      <React.Fragment>
        <MapContainer
          travels={this.state.travels}
          selectedTravel={this.state.selectedTravel}
          setSelectedTravel={this.setSelectedTravel}
          setShowSlideshow={this.setShowSlideshow}
        />
        {slideshow}
      </React.Fragment>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
