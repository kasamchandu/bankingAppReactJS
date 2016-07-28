import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../card';
import EnergyIcon from '../icons/energy-icon';
import { formatNumber } from '../../lib/utils';
import styles from './energy-summary-card.scss';

export default class EnergySummaryCard extends Component {
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

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const { summary } = this.props;
    const value = cx(styles.value, theme['value-cell']);
    const red = '#ff0000';
    const green = '#0c9d3f';

    return (
      <Card
        headerIcon={<EnergyIcon />}
        headerText="Energy"
        className={styles.card}
        onClick={this._handleClick}
      >
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.label}>Today's Use</td>
              <td className={value}>
                {summary.todaysUsage ? `${formatNumber(summary.todaysUsage)}Wh` : '0 Wh'}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>Usage</td>
              <td className={value} style={{ color: red }}>&#9650; {summary.usage}</td>
            </tr>
            <tr>
              <td className={styles.label}>Est. Cost</td>
              <td className={value} style={{ color: green }}>
                {summary.estCost ? `€ ${(summary.estCost).toFixed(2)}` : '€ 0'}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>Mode</td>
              <td className={value}>{summary.mode}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }

  _handleClick = () => {
    const { onClick } = this.props;
    if (onClick) onClick();
  };
}
