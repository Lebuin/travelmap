import * as React from 'react';

interface ZoomButtonProps {
  disabled: boolean,
  onClick(): void,
}

abstract class ZoomButton extends React.Component<ZoomButtonProps, {}> {
  text: string;

  render() {
    return <button
      className="btn btn--raised zoom-btn"
      onClick={this.props.onClick}
      disabled={this.props.disabled}
    >
      {this.text}
    </button>
  }
}

export class ZoomInButton extends ZoomButton {
  text = '+';
}
export class ZoomOutButton extends ZoomButton {
  text = '−';
}
