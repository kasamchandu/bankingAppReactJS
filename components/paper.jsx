import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './paper.scss';

export default class Paper extends Component {
  render() {
    const { className, style, children } = this.props;
    const paperClassNames = classnames(styles.paper, className);

    return <div className={paperClassNames} style={style}>
      {children}
    </div>;
  }
}
