import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Paper from '../paper';
import styles from './modal.scss';

const { API_URL } = process.env;

export default class Modal extends Component {
  static propTypes = {
    onCancelClick: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const classNames = {
      container: cx('container', styles.container)
    };

    return <div className={styles.overlay}>
      <div className={classNames.container}>
        <Paper className={styles.content}>
          {this.props.children}
        </Paper>
      </div>
    </div>;
  }
}
