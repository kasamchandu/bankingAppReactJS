import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../card';
import DeviceLuminaireIcon from '../icons/device-luminaire-icon';
import DeviceSensorIcon from '../icons/device-sensor-icon';
import DeviceControllerIcon from '../icons/device-controller-icon';
import DeviceOtherIcon from '../icons/device-other-icon';
import groupBy from 'lodash/groupBy';
import styles from './devices-card.scss';

export default class DevicesCard extends Component {
  static propTypes = {
    devices: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { devices } = this.props;
    const deviceByTypes = groupBy(devices, 'deviceType');

    return (
      <Card className={styles.card} headerText="Devices">
        <ul className={styles.list}>
          <li className={styles.item}>
            <DeviceLuminaireIcon className={styles.icon} />
            <span className={styles.text}>Luminaires</span>
            <span className={styles.value}>
              {deviceByTypes.LUMINAIRE ? deviceByTypes.LUMINAIRE.length : 0}
            </span>
          </li>
          <li className={styles.item}>
            <DeviceSensorIcon className={styles.icon} />
            <span className={styles.text}>Sensors</span>
            <span className={styles.value}>
              {deviceByTypes.SENSOR ? deviceByTypes.SENSOR.length : 0}
            </span>
          </li>
          <li className={styles.item}>
            <DeviceControllerIcon className={styles.icon} />
            <span className={styles.text}>Controllers</span>
            <span className={styles.value}>
              {deviceByTypes.CONTROLLER ? deviceByTypes.CONTROLLER.length : 0}
            </span>
          </li>
          <li className={styles.item}>
            <DeviceOtherIcon className={styles.icon} />
            <span className={styles.text}>Other</span>
            <span className={styles.value}>
              {deviceByTypes.OTHER ? deviceByTypes.OTHER.length : 0}
            </span>
          </li>
        </ul>
      </Card>
    );
  }
}
