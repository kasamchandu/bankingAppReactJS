import React, { Component, PropTypes } from 'react';
const { COMPANY } = process.env;
const theme = COMPANY
            ? require(`../stylesheets/theme/${COMPANY}.scss`)
            : {};

export default class BaseLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  static childContextTypes = {
    theme: PropTypes.object
  };

  getChildContext() {
    return {
      theme
    };
  }

  render() {
    return this.props.children;
  }
}
