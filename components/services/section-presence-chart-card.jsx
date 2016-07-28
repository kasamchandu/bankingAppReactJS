import d3 from 'd3';
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { Xaxis, Yaxis } from 'react-d3-core';
import { Line, Chart } from 'react-d3-shape';
import Card from '../card';
import SpaceManagementIcon from '../icons/space-management-icon';
import api from '../../lib/api';
import styles from './section-presence-chart-card.scss';

function x(d) {
  return new Date(d.ts);
}

function xTickFormat(d) {
  return d.getHours().toString();
}

export default class SectionPresenceChartCard extends Component {
  static propTypes = {
    section: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    width: '100%',
    isVisible: false
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    this._promises = [];

    this.state = {
      data: [],
      chartWidth: 340,
      chartHeight: 200,
      isGettingPlatformError: false
    };
  }

  render() {
    const { theme } = this.context;
    const { section } = this.props;
    const { data, chartWidth, chartHeight } = this.state;

    const classNames = {
      chartBackgroundColor: cx(styles.bg, theme['chart-bg'])
    };
    const margins = {
      left: 40,
      right: 20,
      top: 10,
      bottom: 20
    };
    const bgStyle = {
      left: 40,
      right: 10,
      top: 10,
      bottom: 24
    };
    const title = 'Energy';
    const chartSeries = [
      {
        field: 'value',
        name: 'Value',
        color: '#fff'
      }
    ];


    return (
      <Card
        headerIcon={<SpaceManagementIcon />}
        headerText={`${section.name}`}
        headerSubtext={`${section.floor || '0'}`}
        className={styles.card}
      >
        <section ref="chartContainer"
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
            yDomain={[0, 100]}
            yTicks={[2]}
            svgClassName={styles.chart}
          >
            <Line chartSeries={chartSeries} />
            <Xaxis xAxisClassName={styles.axis} />
            <Yaxis yAxisClassName={styles.axis} />
          </Chart>
        </section>
      </Card>
    );
  }

  componentDidMount() {
    const { isVisible, section, width } = this.props;

    if (width === '100%') {
      window.addEventListener('resize', this._handleResize);
    }

    if (isVisible) {
      this._getData(section.id);
    }
  }

  // If card becomes invisble, or getting platform error
  // then stop polling.
  // Else if card becomes visible, then start polling
  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.isGettingPlatformError) {
      this.setState({ isGettingPlatformError: false });
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Clear all pending requests
    this._promises.forEach(promise => {
      promise.cancel();
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const DELAY = 5000;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (nextProps.isVisible && !nextState.isGettingPlatformError) {
      this.timeoutId = setTimeout(() => {
        this._getData(nextProps.section.id);
      }, DELAY);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Clear all pending requests
    this._promises.forEach(promise => {
      promise.cancel();
    });
    this._promises = undefined;
    delete this._promises;
  }

  _handleResize = () => {
    this.setState({
      chartWidth: this.refs.chartContainer.offsetWidth
    });
  };

  _getData = (sectionId) => {
    const req = api.get(`/ts/sections/${sectionId}?type=PRESENCE_AGGREGATE&filter=DAY`);

    this._promises.push(req);

    req.then(res => {
      this.setState({ data: res.body });
    }).catch(error => {
      console.log(error);
      this.setState({ isGettingPlatformError: true });
    }).finally(() => {
      if (this._promises) {
        this._promises.pop();
      }
    });
  };
}
