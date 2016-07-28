import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Img from '../img';
import ProvisionServerIcon from '../icons/provision-server-icon';
import ProvisionServerSelectedIcon from '../icons/provision-server-selected-icon';
import UnprovisionServerIcon from '../icons/unprovision-server-icon';
import UnprovisionServerSelectedIcon from '../icons/unprovision-server-selected-icon';

import { imagePath } from '../../lib/utils';
import provisioningJson from '../../fixtures/provision';
import ReactTooltip from 'react-tooltip';
import styles from './servers-list.scss';


export default class SeversCard extends Component {
  static propTypes = {
    onItemClick: PropTypes.func,
    onUnProvisionClick: PropTypes.func,
    onProvisionClick: PropTypes.func,
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      provisioningData: provisioningJson,
      ReactTooltip: ReactTooltip,
      hoverIndex: undefined
    };
  }

  render() {
    const { theme } = this.context;
    const { provisioningData, hoverIndex } = this.state;
    const classNames = {
      row: cx(styles.row, theme['table-row']),
      selected: cx(styles.selected, theme['table-row--selected']),
      provisioningHeader: cx(styles.th, styles.provision),
    };

    return (
      <div className={styles['table-container']}>
        <table className={styles.table}>
          <thead>
            <tr className={styles['table-header']}>
              <th className={styles.th}>Server &#9662;</th>
              <th className={styles.th}>Location &#9662;</th>
              <th className={styles.th}>Date Activated &#9662;</th>
              <th className={styles.th}>Status &#9662;</th>
              <th className={classNames.provisioningHeader}>Provisioning &#9662;</th>
              </tr>
          </thead>
          <tbody>
            {provisioningData.map((provisioning, i) => {
              const rowClassName = cx(classNames.row);

              let icon;
              switch (provisioning.Type) {
                case 'provision':
                  icon = i === hoverIndex
                       ? <ProvisionServerSelectedIcon />
                       : <ProvisionServerIcon />;
                  break;
                case 'unprovision':
                  icon = i === hoverIndex
                       ? <UnprovisionServerSelectedIcon />
                       : <UnprovisionServerIcon />;
                  break;
                default:
                  icon = i === hoverIndex
                       ? <ProvisionServerSelectedIcon />
                       : <ProvisionServerIcon />;
                  break;
              }
              return (
                <tr
                  key={provisioning.id}
                  className={rowClassName}
                  onMouseEnter={this._handleProvisionSelected.bind(this, i)}
                  onMouseLeave={this._handleProvisionUnselected.bind(this, i)}
                >
                  <td className={styles.td}>
                    <div>{provisioning.server}</div>
                    <div>{provisioning.macaddress}</div>
                  </td>
                  <td className={styles.td}>
                    <span data-tip="Connected Devices: 15">{provisioning.location}</span>
                    <ReactTooltip place="bottom" type="light" effect="solid"/>
                  </td>
                  <td className={styles.td}>
                    {provisioning.date}
                  </td>
                  <td className={styles.td}>
                    <span className={ provisioning.val ? styles['status-online'] : styles['status-offline']} />
                    <span data-tip="Online Since: 00-00-00 14:00">{provisioning.status}</span>
                    <ReactTooltip place="bottom" type="light" effect="solid"/>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={styles['provision-link']}
                      onClick={this._handleCheckUpdates.bind(this, provisioning.Type)}
                      data-tip="Customer Name: SPAR"
                    >
                     {icon}
                    </span>
                    <ReactTooltip place="bottom" type="light" effect="solid" border="true" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  _handleCheckUpdates = (Type) => {
    const { onProvisionClick } = this.props;
    const { onUnProvisionClick } = this.props;
    if (Type === 'unprovision') {
      if (onProvisionClick) onProvisionClick();
    }
    else {
      if (onUnProvisionClick) onUnProvisionClick();
    }
  };

  _handleProvisionSelected = (i) => {
    this.setState({
      hoverIndex: i
    });
  };

  _handleProvisionUnselected = (i) => {
    if (this.state.activeIndex !== i) {
      this.setState({
        hoverIndex: undefined
      });
    }
  };
}
