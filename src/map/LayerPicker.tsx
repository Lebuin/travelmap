import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
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
          className="btn btn--map"
          onClick={this.toggleMenu}
        >
          <i className="far fa-layer-group"></i>
        </button>

        {this.renderMenu()}
      </React.Fragment>
    );
  }


  renderMenu() {
    return (
      <React.Fragment>
        <CSSTransition
          in={this.state.showMenu}
          timeout={{
            enter: 500,
            exit: 300,
          }}
          classNames="animate"
        >
          <div className="layer-picker__overlay" onClick={this.toggleMenu}></div>
        </CSSTransition>

        <CSSTransition
          in={this.state.showMenu}
          timeout={{
            enter: 300,
            exit: 200,
          }}
          classNames="animate"
        >
          <div className="layer-picker__box">
            <div className="layer-picker__header">
              <h2 className="layer-picker__title">Layers</h2>
              <div className="btn btn--round" onClick={this.toggleMenu}>
                <i className="far fa-times"></i>
              </div>
            </div>

            <div className="layer-picker__content">
              {tileProviders.map(tileProvider => {
                let classNames = 'btn layer-picker__item';
                if(tileProvider === this.props.tileProvider) {
                  classNames += ' selected';
                }
                return (
                  <div
                    key={tileProvider.name}
                    className={classNames}
                    onClick={this.setTileProvider.bind(this, tileProvider)}
                  >
                    <div className="layer-picker__item-content">
                      {tileProvider.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CSSTransition>
      </React.Fragment>
    );
  }
}
