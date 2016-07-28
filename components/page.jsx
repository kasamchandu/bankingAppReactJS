import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './page.scss';

export default class Page extends Component {
  render() {
    const { className, style } = this.props;
    const pageClassNames = classnames(styles.page, className);

    return <div className={pageClassNames} style={style}>
      {this.props.children}
    </div>;
  }
}
