import React, { Component } from 'react';
import { imagePath } from '../lib/utils';
import styles from './logo.scss';
const { COMPANY } = process.env;

export default class Logo extends Component {
  render() {
    return (
      <img
        className={styles.logo}
        src={imagePath(`/images/${COMPANY}/login-logo.png`)}
      />
    );
  }
}
