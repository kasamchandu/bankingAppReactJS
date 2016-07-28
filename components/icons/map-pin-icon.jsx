import React, { Component, PropTypes } from 'react';
import Icon from './icon';
import { imagePath } from '../../lib/utils';
const { COMPANY } = process.env;

export default class MapPinIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, style } = this.props;

    return (
      <Icon
        className={className}
        src={imagePath(`/images/${COMPANY}/icons/map-pin.png`)}
        style={Object.assign({ width: 40, height: 40 }, style)}
      />
    );
  }
}
