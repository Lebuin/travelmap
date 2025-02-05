import * as React from 'react';
import { MdOutlineClose, MdOutlineLayers } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon';
import tileProviders, { TileProvider } from './tileProviders';

interface LayerPickerProps {
  tileProvider: TileProvider;
  setTileProvider(tileProvider: TileProvider): void;
}

interface LayerPickerState {
  showMenu: boolean;
}

export default class LayerPicker extends React.Component<
  LayerPickerProps,
  LayerPickerState
> {
  private nodeRefs: React.RefObject<HTMLDivElement | null>[];

  constructor(props: LayerPickerProps) {
    super(props);
    this._bind();

    this.state = {
      showMenu: false,
    };

    this.nodeRefs = [React.createRef(), React.createRef()];
  }

  _bind() {
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  setTileProvider(tileProvider: TileProvider) {
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
          <Icon icon={MdOutlineLayers} />
        </button>

        {this.renderMenu()}
      </React.Fragment>
    );
  }

  renderMenu() {
    return (
      <React.Fragment>
        <CSSTransition
          nodeRef={this.nodeRefs[0]}
          in={this.state.showMenu}
          timeout={{
            enter: 500,
            exit: 300,
          }}
          classNames="animate"
        >
          <div
            ref={this.nodeRefs[0]}
            className="layer-picker__overlay"
            onClick={this.toggleMenu}
          ></div>
        </CSSTransition>

        <CSSTransition
          nodeRef={this.nodeRefs[1]}
          in={this.state.showMenu}
          timeout={{
            enter: 300,
            exit: 200,
          }}
          classNames="animate"
        >
          <div
            ref={this.nodeRefs[1]}
            className="layer-picker__box"
          >
            <div className="layer-picker__header">
              <h2 className="layer-picker__title">Layers</h2>
              <div
                className="btn btn--round"
                onClick={this.toggleMenu}
              >
                <Icon icon={MdOutlineClose} />
              </div>
            </div>

            <div className="layer-picker__content">
              {tileProviders.map((tileProvider) => {
                let classNames = 'btn layer-picker__item';
                if (tileProvider === this.props.tileProvider) {
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
