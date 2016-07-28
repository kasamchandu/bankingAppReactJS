import React, { Component, PropTypes } from 'react';
import Icon from './icon';
import { imagePath } from '../../lib/utils';

export default class EnergyIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, style } = this.props;

    return <Icon
      className={className}
      src={imagePath('/images/icons/energy.png')}
      style={Object.assign({ width: 20, height: 16 }, style)}
    />;
  }
}
