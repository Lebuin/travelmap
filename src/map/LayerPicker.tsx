import * as React from 'react';
import tileProviders, { TileProvider } from './tileProviders';


interface LayerPickerProps {
  tileProvider: TileProvider,
  setTileProvider(tileProvider: TileProvider): any,
}

interface LayerPickerState {
  showMenu: boolean,
}


export default class LayerPicker extends React.Component<LayerPickerProps, LayerPickerState> {
  constructor(props: LayerPickerProps) {
    super(props);
    this._bind();

    this.state = {
      showMenu: false,
    };
  }

  _bind() {
    this.toggleMenu = this.toggleMenu.bind(this);
  }


  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  setTileProvider(tileProvider) {
    this.props.setTileProvider(tileProvider);
    this.setState({
      showMenu: false,
    });
  }


  render() {
    return (
      <React.Fragment>
        <button
          className="btn--map layer-picker__btn"
          onClick={this.toggleMenu}
        >
          <i className="far fa-layer-group"></i>
        </button>
        {this.renderMenu()}
      </React.Fragment>
    );
  }


  renderMenu() {
    if(!this.state.showMenu) {
      return;
    }

    return (
      <div className="layer-picker__wrapper">
        <div className="layer-picker__overlay" onClick={this.toggleMenu}></div>
        <div className="layer-picker">
          <h2>Layers</h2>
          {tileProviders.map(tileProvider => {
            let classNames = 'btn layer-picker__item';
            if(tileProvider === this.props.tileProvider) {
              classNames += ' selected';
            }
            return (
              <button
                key={tileProvider.name}
                className={classNames}
                onClick={this.setTileProvider.bind(this, tileProvider)}
              >
                {tileProvider.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
