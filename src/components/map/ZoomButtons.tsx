import * as React from 'react';
import { ZoomInButton, ZoomOutButton } from './ZoomButton';

interface ZoomButtonsProps {
  zoomLevel: number;
  minZoomLevel: number;
  maxZoomLevel: number;
  onZoomLevelChange(zoomLevel: number): void;
}

export default class ZoomButtons extends React.Component<
  ZoomButtonsProps,
  object
> {
  constructor(props: ZoomButtonsProps) {
    super(props);
    this.bind();
  }

  bind() {
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
  }

  onZoomIn() {
    this.props.onZoomLevelChange(this.props.zoomLevel + 1);
  }

  onZoomOut() {
    this.props.onZoomLevelChange(this.props.zoomLevel - 1);
  }

  render() {
    return (
      <div className="zoom-btns">
        <ZoomInButton
          disabled={this.props.zoomLevel >= this.props.maxZoomLevel}
          onClick={this.onZoomIn}
        />
        <ZoomOutButton
          disabled={this.props.zoomLevel <= this.props.minZoomLevel}
          onClick={this.onZoomOut}
        />
      </div>
    );
  }
}
