import React, { Component, PropTypes } from 'react';
import Paper from '../paper';
import cx from 'classnames';
import SoftwareUpdateIcon from '../icons/software-update-icon';
import RebootServerIcon from '../icons/reboot-server-icon';
import UnprovisionServerIcon from '../icons/unprovision-server-icon';
import NetworkSettingsIcon from '../icons/network-settings-icon';
import RefreshIcon from '../icons/refresh-icon';
import ViewLogIcon from '../icons/view-log-icon';
import CloudIcon from '../icons/cloud-icon';
import RequestIcon from '../icons/request-icon';
import { formatDate } from '../../lib/utils';
import styles from './server-details-card.scss';

export default class ServerDetailsCard extends Component {
  static propTypes = {
    server: PropTypes.object
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const { server } = this.props;
    const ipv6 = (server.ipv6 && (server.ipv6.length > 1))
               ? server.ipv6[1].split('%')[0]
               : '';
    const classNames = {
      btn: cx(styles.btn, theme['btn-primary'])
    };

    return (<Paper className={styles.container}>
      <div className={styles['server-details-list']}>
        <table>
          <tbody>
            <tr>
              <td className={styles['servers-details-title']}>{server.name}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>Hardware: {server.hardwareVersion}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>Date Added: {formatDate(new Date(server.createDate))}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>IPv4 Address: {server.ip}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>IPv6 Address: {ipv6}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>MAC Address: {server.mac}</td>
            </tr>
            <tr className={styles['server-api']}>
              <td>Software: {server.firmwareVersion}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles['btn-wrapper']}>
        <ul>
          <li className={styles['btn-list']}>
            <button disabled type="button" className={classNames.btn}>
              <SoftwareUpdateIcon />
              Software Update
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
              Unprovision Server
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
              <RefreshIcon />
              Refresh All Devices
            </button>
          </li>
          <li className={styles['btn-list']}>
            <button disabled type="button" className={classNames.btn}>
              <ViewLogIcon />
              View Log History
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
    </Paper>);
  }
}
