import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../card';
import SpaceManagementIcon from '../icons/space-management-icon';
import styles from './space-management-summary-card.scss';

export default class SpaceManagementSummaryCard extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    summary: PropTypes.object
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  static defaultProps = {
    summary: {}
  };

  render() {
    const { theme } = this.context;
    const { summary } = this.props;
    const value = cx(styles.value, theme['value-cell']);

    return (<Card
      headerIcon={<SpaceManagementIcon />}
      headerText="Space Management"
      className={styles.card}
      onClick={this._handleClick}
    >
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>Total Occupancy</td>
            <td className={value}>
              {summary.totalOccupency ? `${Math.round(summary.totalOccupency)}%` : '0%'}
            </td>
          </tr>
        </tbody>
        <tbody>
          {summary.sections && summary.sections.map((section, index) => (
            <tr key={index}>
              <td className={styles.label}>{section.name}</td>
              <td className={value}>
                {section.avgOccupancy ? `${Math.round(section.avgOccupancy)}%` : '0%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>);
  }

  _handleClick = () => {
    const { onClick } = this.props;
    if (onClick) onClick();
  };
}
