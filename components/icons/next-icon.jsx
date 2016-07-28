import React, { Component, PropTypes } from 'react';
import Icon from './icon';
import { imagePath } from '../../lib/utils';
const { COMPANY } = process.env;

export default class NextIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, style, isPageLoaded } = this.props;

    return (
      <Icon
        className={className}
        src={imagePath(`/images/${COMPANY}/icons/next.png`)}
        hoverSrc={imagePath(`/images/${COMPANY}/icons/next-pressed.png`)}
        style={Object.assign({ width: 40, height: 40 }, style)}
        isPageLoaded={isPageLoaded}
      />
    );
  }
}
