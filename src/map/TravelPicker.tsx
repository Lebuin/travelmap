import * as React from 'react';
import { travels } from './travels';


interface TravelPickerState {
  showMenu: boolean,
}


export default class TravelPicker extends React.Component<{}, TravelPickerState> {
  constructor(props: {}) {
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
    })
  }


  setTravel(travel) {
    // TODO
  }


  render() {
    return (
      <React.Fragment>
        <button
          className="btn--map layer-picker__btn"
          onClick={this.toggleMenu}
        >
          <i className="far fa-route"></i>
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
          <div className="layer-picker__header">
            <h2 className="layer-picker__title">Travels</h2>
            <div className="btn btn--round" onClick={this.toggleMenu}>
              <i className="far fa-times"></i>
            </div>
          </div>
          <div className="layer-picker__content">
            {travels.map(travel => {
              let classNames = 'btn layer-picker__item';
              if(!travel) {
                classNames += ' selected';
              }
              return (
                <div
                  key={travel.id}
                  className={classNames}
                  onClick={this.setTravel.bind(this, travel)}
                >
                  <div
                    className="layer-picker__item-border"
                    style={{ background: travel.color }}
                  ></div>
                  <div className="layer-picker__item-icon">
                    {travel.renderIcon()}
                  </div>
                  <div className="layer-picker__item-content">
                    <div className="layer-picker__item-name">{travel.name}</div>
                    <div className="layer-picker__item-info">
                      {travel.renderDateRange()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
