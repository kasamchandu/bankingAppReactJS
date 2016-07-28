import React, { Component, PropTypes } from 'react';
import Paper from '../paper';
import cx from 'classnames';
import SoftwareUpdateIcon from '../icons/software-update-icon';
import RebootServerIcon from '../icons/reboot-server-icon';
import UnprovisionServerIcon from '../icons/unprovision-server-icon';
import NetworkSettingsIcon from '../icons/network-settings-icon';
import ViewLogIcon from '../icons/view-log-icon';
import CloudIcon from '../icons/cloud-icon';
import RequestIcon from '../icons/request-icon';
import { formatDate } from '../../lib/utils';
import styles from './device-detail-card.scss';

export default class DeviceDetailCard extends Component {
  static propTypes = {
    device: PropTypes.object
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const { device } = this.props;
    const classNames = {
      btn: cx(styles.btn, theme['btn-primary'])
    };

    return (
      <Paper className={styles.container}>
        <div className={styles['details-list']}>
          <table>
            <tbody>
              <tr>
                <td className={styles['details-title']}>{device.name}</td>
              </tr>
              <tr className={styles['device-api']}>
                <td>Hardware: {device.hardwareVersion}</td>
              </tr>
              <tr className={styles['device-api']}>
                <td>Date Added: {device.discovered ? formatDate(new Date(device.discovered * 1000)) : ''}</td>
              </tr>
              <tr className={styles['device-api']}>
                <td>IP Address: {device.ip}</td>
              </tr>
              <tr className={styles['device-api']}>
                <td>MAC Address: {device.mac ? device.mac : ((device.udid && device.udid.match(/ep-/i)) ? device.udid.slice(3) : '')}</td>
              </tr>
              <tr className={styles['device-api']}>
                <td>Firmware: {device.firmwareVersion ? device.firmwareVersion.split(' ')[0] : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles['btn-wrapper']}>
          <ul>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <SoftwareUpdateIcon />
                Firmware Update
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <RebootServerIcon />
                Reboot Server
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <UnprovisionServerIcon />
                Unprovision/Replace Device
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <NetworkSettingsIcon />
                Network Settings
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <ViewLogIcon />
                View Log/History
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <CloudIcon />
                Bootstrap to other Cloud Server
              </button>
            </li>
            <li className={styles['btn-list']}>
              <button disabled type="button" className={classNames.btn}>
                <RequestIcon />
                Request Service
              </button>
            </li>
          </ul>
        </div>
      </Paper>
    );
  }
}
