import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../card';
import Img from '../img';
import { formatDate, imagePath } from '../../lib/utils';
import styles from './location-details-card.scss';

export default class LocationDetailsCard extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onCheckUpdateClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const { location } = this.props;
    const {
      id,
      name,
      street,
      city,
      zip,
      state,
      floorCount,
      sectionCount,
      serverCount,
      deviceCount
    } = location;
    const src = id ? location.photoUrl : undefined;
    const classNames = {
      address: cx(styles.address, theme.link),
      btn: cx('btn', styles['update-btn'], theme['btn-primary'])
    };

    return (
      <Card
        className={styles['location-details-container']}
        headerText="Location Details"
      >
        <div className={styles['location-image']}>
          <Img
            className={styles.image}
            src={src}
            defaultSrc={imagePath('/images/default-company.jpg')}
            useBackground
          />
        </div>

        <div className={styles['location-content']}>
          <label>{name}</label>
          <div className={classNames.address}>
            {street ? street + ',' : ''}<br />
            {city} {state} {zip}
          </div>
          <ul>
            <li>Floors: {floorCount}</li>
            <li>Sections: {sectionCount}</li>
            <li>Servers: {serverCount}</li>
            <li>Devices: {deviceCount}</li>
          </ul>
        </div>
        <div className={styles['install-detail']}>
          <label>Install Date: {formatDate(new Date(location.installDate))}</label>
          <label>Last Service: {formatDate(new Date(location.lastServiceDate))}</label>
          <div className={styles['update-btn-container']}>
            <button
              type="button"
              className={classNames.btn}
              onClick={this._handleCheckUpdates}
            >
              Check for updates
            </button>
          </div>
        </div>
      </Card>
    );
  }

  _handleCheckUpdates = () => {
    const { onCheckUpdateClick } = this.props;
    if (onCheckUpdateClick) onCheckUpdateClick();
  };
}
