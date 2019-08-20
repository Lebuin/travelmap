import * as React from 'react';

interface ZoomButtonProps {
  disabled: boolean,
  onClick(): any,
}

abstract class ZoomButton extends React.Component<ZoomButtonProps, {}> {
  faName: string;

  render() {
    return <button
      className="btn--map"
      onClick={this.props.onClick}
      disabled={this.props.disabled}
    >
      <i className={`far ${this.faName}`}></i>
    </button>
  }
}

export class ZoomInButton extends ZoomButton {
  faName = 'fa-plus';
}
export class ZoomOutButton extends ZoomButton {
  faName = 'fa-minus';
}
