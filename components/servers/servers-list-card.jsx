import React, { Component, PropTypes } from 'react';
import Card from '../card';
import cx from 'classnames';
import { formatDate } from '../../lib/utils';
import styles from './servers-list-card.scss';

export default class SeversCard extends Component {
  static propTypes = {
    servers: PropTypes.array,
    onItemClick: PropTypes.func,
    onItemDeviceClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  render() {
    const { theme } = this.context;
    const { servers } = this.props;
    const { activeIndex } = this.state;
    const classNames = {
      deviceHeader: cx(styles.th, styles.device),
      deviceCount: cx(styles.td, styles['device-count']),
      row: cx(styles.row, theme['table-row']),
      selected: cx(styles.selected, theme['table-row--selected'])
    };

    return (
      <Card
        className={styles.container}
        headerText="Servers"
      >
        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead>
              <tr className={styles['table-header']}>
                <th className={styles.th}>Server Name</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Software</th>
                <th className={styles.th}>Hardware</th>
                <th className={styles.th}>Date Added</th>
                <th className={classNames.deviceHeader}>#Devices</th>
              </tr>
            </thead>
            <tbody className={styles.scrollable}>
              {servers.map((server, i) => {
                const rowClassName = cx(classNames.row, {
                  [classNames.selected]: i === activeIndex
                });

                return (
                  <tr
                    key={server.id}
                    className={rowClassName}
                    onClick={this._handleServerClick.bind(this, server.id, i)}
                  >
                    <td className={styles.td}>
                      {server.name}
                    </td>
                    <td className={styles.td}>
                      {server.status}
                    </td>
                    <td className={styles.td}>
                      {server.firmwareVersion}
                    </td>
                    <td className={styles.td}>
                      {server.hardwareVersion}
                    </td>
                    <td className={styles.td}>
                      {formatDate(new Date(server.createDate))}
                    </td>
                    <td className={classNames.deviceCount}>
                      <span
                        className={styles['device-count-link']}
                        onClick={this._handleDeviceClick.bind(this, server.id)}
                      >
                        {server.deviceCount || 0}
                      </span>
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

  _handleServerClick = (serverId, i) => {
    const { onItemClick } = this.props;
    if (onItemClick) onItemClick(serverId);

    this.setState({
      activeIndex: i
    });
  };

  _handleDeviceClick = (serverId) => {
    const { onItemDeviceClick } = this.props;
    if (onItemDeviceClick) onItemDeviceClick(serverId);
  };
}
