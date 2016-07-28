import React, { Component, PropTypes } from 'react';
import Card from '../card';
import { formatDate, imagePath } from '../../lib/utils';
import styles from './server-details-card.scss';

export default class ServerDetailsCard extends Component {
  static propTypes = {
    server: PropTypes.object
  };

  constructor(props) {
    super(props);

  }

  render() {
    const { server } = this.props;

    const src = imagePath('/images/default-server.jpg');

    return <Card
      className={styles['server-details-container']}
      headerText="Server Details">
      <div className={styles['server-image']}>
        <img src={src} />
      </div>

      <div className={styles['server-content']}>
        <ul>
          <li>Server Name: {server.name}</li>
          <li>Status: {server.status}</li>
          <li>Software: {server.firmwareVersion}</li>
          <li>Hardware: {server.hardwareVersion}</li>
          <li>Date Added: {formatDate(new Date(server.createDate))}</li>
          <li># of Devices: {server.deviceCount || 0}</li>
        </ul>
      </div>
      <div className={styles['server-detail']}>
        {server.lastServiceDate &&
        <label>Last Service: {formatDate(new Date(server.lastServiceDate))}</label>}
      </div>
    </Card>;
  }
}
