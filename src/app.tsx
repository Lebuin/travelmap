import './app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MapContainer } from './map';
import Travel from './travels/Travel';
import travels from './travels/travels';


interface AppState {
  travels: Travel[],
  selectedTravel: Travel,
}


class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this._bind();

    this.state = {
      travels: travels,
      selectedTravel: null,
    };
  }

  _bind() {
    this.setSelectedTravel = this.setSelectedTravel.bind(this);
  }


  setSelectedTravel(travel: Travel) {
    this.setState({
      selectedTravel: travel,
    });
  }


  public render() {
    return (
      <MapContainer
        travels={this.state.travels}
        selectedTravel={this.state.selectedTravel}
        setSelectedTravel={this.setSelectedTravel}
      />
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
