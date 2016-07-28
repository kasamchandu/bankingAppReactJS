import React, { Component } from 'react';
import Card from '../card';
import styles from './notifications-card.scss';

export default class NotificationsCard extends Component {
  render() {
    return <Card
      className={styles['notification-container']}
      headerText="Notifications">
      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.text}>Overall Status</span>
          <span className={styles['status-indicator']} />
        </li>
      </ul>
    </Card>;
  }
}
