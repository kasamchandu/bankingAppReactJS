import React, { Component, PropTypes } from 'react';
import Card from '../card';
import cx from 'classnames';
import DeviceLuminaireIcon from '../icons/device-luminaire-icon';
import DeviceLuminaireSelectedIcon from '../icons/device-luminaire-selected-icon';
import DeviceControllerIcon from '../icons/device-controller-icon';
import DeviceControllerSelectedIcon from '../icons/device-controller-selected-icon';
import DeviceSensorIcon from '../icons/device-sensor-icon';
import DeviceSensorSelectedIcon from '../icons/device-sensor-selected-icon';
import DeviceOtherIcon from '../icons/device-other-icon';
import DeviceOtherSelectedIcon from '../icons/device-other-selected-icon';
import styles from './devices-card.scss';

export default class DevicesCard extends Component {
  static propTypes = {
    devices: PropTypes.array,
    onItemClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      hoverIndex: undefined
    };
  }

  render() {
    const { theme } = this.context;
    const { devices } = this.props;
    const { activeIndex, hoverIndex } = this.state;
    const classNames = {
      row: cx(styles.row, theme['table-row']),
      selected: cx(styles.selected, theme['table-row--selected'])
    };

    return (
      <Card
        className={styles.container}
        headerText="Devices"
      >
        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead>
              <tr className={styles['table-header']}>
                <th className={styles.th}>Device ID</th>
                <th className={styles.th}>Type</th>
                <th className={styles.th}>Firmware</th>
                <th className={styles.th}>Hardware</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody className={styles.scrollable}>
              {devices.map((device, i) => {
                const rowClassName = cx(classNames.row, {
                  [classNames.selected]: i === activeIndex
                });

                let icon;
                switch (device.deviceType) {
                  case 'LUMINAIRE':
                    icon = i === hoverIndex || i === activeIndex
                         ? <DeviceLuminaireSelectedIcon />
                         : <DeviceLuminaireIcon />;
                    break;
                  case 'CONTROLLER':
                    icon = i === hoverIndex || i === activeIndex
                         ? <DeviceControllerSelectedIcon />
                         : <DeviceControllerIcon />;
                    break;
                  case 'SENSOR':
                    icon = i === hoverIndex || i === activeIndex
                         ? <DeviceSensorSelectedIcon />
                         : <DeviceSensorIcon />;
                    break;
                  default:
                    icon = i === hoverIndex || i === activeIndex
                         ? <DeviceOtherSelectedIcon />
                         : <DeviceOtherIcon />;
                    break;
                }
                return (
                  <tr
                    key={device.id}
                    className={rowClassName}
                    onClick={this._handleDeviceClick.bind(this, device.id, i)}
                    onMouseEnter={this._handleDeviceSelected.bind(this, i)}
                    onMouseLeave={this._handleDeviceUnselected.bind(this, i)}
                  >
                    <td className={styles.td}>
                      {device.name}
                    </td>
                    <td className={styles.td}>
                      {icon}
                    </td>
                    <td className={styles.td}>
                      {device.firmwareVersion ? device.firmwareVersion.split(' ')[0] : ''}
                    </td>
                    <td className={styles.td}>
                      {device.hardwareVersion}
                    </td>
                    <td className={styles.td}>
                      {device.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  _handleDeviceClick = (deviceId, i) => {
    const { onItemClick } = this.props;
    if (onItemClick) onItemClick(deviceId);

    this.setState({
      activeIndex: i
    });
  };

  _handleDeviceSelected = (i) => {
    this.setState({
      hoverIndex: i
    });
  };

  _handleDeviceUnselected = (i) => {
    if (this.state.activeIndex !== i) {
      this.setState({
        hoverIndex: undefined
      });
    }
  };
}
