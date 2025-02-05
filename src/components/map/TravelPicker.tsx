import Travel from '@/components/travels/Travel';
import * as React from 'react';
import { MdOutlineClose, MdOutlineRoute } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon';


interface TravelPickerProps {
  travels: Array<Travel>,
  selectedTravel?: Travel,
  setSelectedTravel(travel: Travel): any,
}

interface TravelPickerState {
  showMenu: boolean,
}


export default class TravelPicker extends React.Component<TravelPickerProps, TravelPickerState> {
  private nodeRefs: React.RefObject<HTMLDivElement | null>[];

  constructor(props: TravelPickerProps) {
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
    })
  }


  setTravel(travel: Travel) {
    this.props.setSelectedTravel(travel);
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
          <Icon icon={MdOutlineRoute} />
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
              <h2 className="layer-picker__title">Travels</h2>
              <div className="btn btn--round" onClick={this.toggleMenu}>
                <Icon icon={MdOutlineClose} />
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
