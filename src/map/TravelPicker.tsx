import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import Travel from './Travel';


interface TravelPickerProps {
  travels: Array<Travel>,
  selectedTravel: Travel,
  setSelectedTravel(travel: Travel): any,
}

interface TravelPickerState {
  showMenu: boolean,
}


export default class TravelPicker extends React.Component<TravelPickerProps, TravelPickerState> {
  constructor(props: TravelPickerProps) {
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


  setTravel(travel, event) {
    this.props.setSelectedTravel(travel);
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
          <i className="far fa-route"></i>
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
              <h2 className="layer-picker__title">Travels</h2>
              <div className="btn btn--round" onClick={this.toggleMenu}>
                <i className="far fa-times"></i>
              </div>
            </div>
            <div className="layer-picker__content">
              {this.props.travels.map(travel => {
                let classNames = 'btn layer-picker__item';
                if(travel === this.props.selectedTravel) {
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
        </CSSTransition>
      </React.Fragment>
    );
  }
}
