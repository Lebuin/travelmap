import './app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MapContainer } from './map';



class App extends React.Component {
  public render() {
    return (
      <MapContainer />
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
