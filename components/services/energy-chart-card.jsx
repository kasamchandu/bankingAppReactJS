import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import d3 from 'd3';
import { Xaxis, Yaxis } from 'react-d3-core';
import { Line, Chart } from 'react-d3-shape';
import Card from '../card';
import BarChartIcon from '../icons/bar-chart-icon';
import styles from './energy-chart-card.scss';
const moment = require('moment'); // can't use ES6 import

// For xScale
function x(d) {
  return new Date(d.ts);
}

function xTickFormat(d) {
  return d.getHours().toString();
}

export default class EnergyChartCard extends Component {
  static propTypes = {
    data: PropTypes.array,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    width: '100%'
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 800,
      chartHeight: 430
    };
  }

  render() {
    const { theme } = this.context;
    const { data } = this.props;
    const { chartWidth, chartHeight } = this.state;

    const classNames = {
      chartBackgroundColor: cx(styles.bg, theme['chart-bg'])
    };

    const margins = {
      left: 40,
      right: 20,
      top: 10,
      bottom: 30
    };
    const bgStyle = {
      left: 40,
      right: 20,
      top: 10,
      bottom: 43
    };

    const title = 'Energy';
    const chartSeries = [
      {
        field: 'value',
        name: 'W',
        color: '#fff'
      }
    ];

    return (<Card
      headerIcon={<BarChartIcon />}
      headerText="Energy"
      action={moment().format('MMMM DD, YYYY hh:mm')}
      className={styles.card}
    >
      <section
        ref="chartContainer"
        className={styles['chart-container']}
      >
        <div className={classNames.chartBackgroundColor} style={bgStyle} />
        <Chart
          margins={margins}
          title={title}
          data={data}
          width={chartWidth}
          height={chartHeight}
          chartSeries={chartSeries}
          x={x}
          xScale="time"
          xTicks={d3.time.scale().ticks(d3.time.hour, 3)}
          xTickFormat={xTickFormat}
          yDomain={[0, 500]}
          yTicks={[4]}
        >
          <Line chartSeries={chartSeries} />
          <Xaxis xAxisClassName={styles.axis} />
          <Yaxis yAxisClassName={styles.axis} />
        </Chart>
      </section>
    </Card>);
  }

  componentDidMount() {
    if (this.props.width === '100%') {
      window.addEventListener('resize', this._handleResize);
      this._handleResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize = () => {
    this.setState({
      chartWidth: this.refs.chartContainer.offsetWidth
    });
  };
}
