import React, { Component, PropTypes } from 'react';
import Icon from './icon';
import { imagePath } from '../../lib/utils';

export default class GroupListviewIcon extends Component {
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
      src={imagePath('/images/icons/group-listview.png')}
      style={Object.assign({ width: 24, height: 24 }, style)}
    />;
  }
}
