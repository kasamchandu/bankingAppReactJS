
import React, { Component, PropTypes } from 'react';
import Card from '../card';
import cx from 'classnames';
import styles from './resources-card.scss';
import { formatNumber } from '../../lib/utils';

export default class ResourcesCard extends Component {
  static propTypes = {
    device: PropTypes.object,
    onToggleClick: PropTypes.func,
    onIdentifyClick: PropTypes.func,
    onReadBtnClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderSelectedDevice = (capability, index) => {
    const { theme } = this.context;
    const { device } = this.props;
    const btn = cx('btn', styles['action-btn'], theme['btn-primary']);

    switch (capability) {
      case 'LIGHT':
        const status = device.light
                     ? (device.light.on ? 'On' : 'Off')
                     : '--';
        return [
          <tr key={`${index}-status`}>
            <td className={styles.td}>
              State
            </td>
            <td className={styles.td}>
              {status}
            </td>
            <td className={styles.td}>
              <button
                type="button"
                className={btn}
                onClick={this._handleDeviceClick}
              >
                Read
              </button>
            </td>
          </tr>,
          <tr key={`${index}-toggle`}>
            <td className={styles.td}>
              Toggle
            </td>
            <td className={styles.td}>
              --
            </td>
            <td className={styles.td}>
              <button
                type="button"
                className={btn}
                onClick={this._handleToggleClick}
              >
                Execute
              </button>
            </td>
          </tr>
        ];
      case 'BRIGHTNESS':
        return (
          <tr key={index}>
            <td className={styles.td}>
              Level
            </td>
            <td className={styles.td}>
              {device.brightness ? `${device.brightness.level}%` : '--'}
            </td>
            <td className={styles.td}>
              <button
                type="button"
                className={btn}
                onClick={this._handleDeviceClick}
              >
                  Read
              </button>
            </td>
          </tr>
        );
      case 'IDENTIFY':
        return (
          <tr key={index}>
            <td className={styles.td}>
              Identify
            </td>
            <td className={styles.td}>
              --
            </td>
            <td className={styles.td}>
              <button
                type="button"
                className={btn}
                onClick={this._handleIdentifyClick}
              >
                Execute
              </button>
            </td>
          </tr>
        );
      case 'POWER':
        return (
          <tr key={index}>
            <td className={styles.td}>
              Energy
            </td>
            <td className={styles.td}>
              {device.power ? `${formatNumber(device.power.currentWatts)}W` : '--'}
            </td>
            <td className={styles.td}>
              <button
                type="button"
                className={btn}
                onClick={this._handleDeviceClick}
              >
                Read
              </button>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  render() {
    const { device } = this.props;
    // Capabilities is not an array.
    // It's a string, and it's not in JSON format,
    // so it needs to be formatted to a proper JSON string.
    const stringify = device.capabilities && device.capabilities.replace(/([^\[\],\s]+)/g, '"$&"');
    const capabilites = stringify && JSON.parse(stringify);

    return (
      <Card
        className={styles.container}
        headerText="Resources"
      >
        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead>
              <tr className={styles['table-header']}>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>State</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {capabilites && capabilites.map(this.renderSelectedDevice)}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  _handleDeviceClick = () => {
    const { device, onReadBtnClick } = this.props;

    if (onReadBtnClick) onReadBtnClick(device.id);
  };

  _handleToggleClick = () => {
    const { device, onToggleClick } = this.props;

    if (device.light && onToggleClick) {
      onToggleClick(device.id, device.light.on);
    }
  };

  _handleIdentifyClick = () => {
    const { device, onIdentifyClick } = this.props;

    if (onIdentifyClick) onIdentifyClick(device.id);
  };
}
