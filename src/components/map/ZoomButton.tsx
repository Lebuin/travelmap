import * as React from 'react';
import { IconType } from 'react-icons';
import { MdOutlineAdd, MdOutlineRemove } from 'react-icons/md';
import Icon from '../icon';

interface ZoomButtonProps {
  disabled: boolean;
  onClick(): void;
}

abstract class ZoomButton extends React.Component<ZoomButtonProps, object> {
  abstract readonly icon: IconType;

  render() {
    return (
      <button
        className="btn btn--map"
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        <Icon icon={this.icon} />
      </button>
    );
  }
}

export class ZoomInButton extends ZoomButton {
  readonly icon = MdOutlineAdd;
}
export class ZoomOutButton extends ZoomButton {
  readonly icon = MdOutlineRemove;
}
