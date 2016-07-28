import React, { Component, PropTypes } from 'react';
import { PieChart } from 'react-d3-basic';
import FootprintIcon from '../icons/footprint-icon';
import Card from '../card';
import styles from './energy-footprint-chart-card.scss';

export default class EnergyChartCard extends Component {
  static propTypes = {
    data: PropTypes.array,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    width: '100%'
  };

  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 300,
      chartHeight: 130
    };
  }

  render() {
    const { data } = this.props;
    const { chartWidth, chartHeight } = this.state;
    const chartSeries = [
      {
        field: 'CO2'
      },
      {
        field: 'SO2'
      },
      {
        field: 'NOX'
      }
    ];
    const name = d => d.name;
    const value = d => d.footprint;

    return (
      <Card
        headerIcon={<FootprintIcon />}
        headerText={`Footprint ${new Date().getFullYear()}`}
        className={styles.card}
      >
        <section
          ref="chartContainer"
          className={styles['chart-container']}
        >
          <PieChart
            title="Footprint"
            data={data}
            chartSeries={chartSeries}
            width={chartWidth}
            height={chartHeight}
            radius={50}
            name={name}
            value={value}
            legendClassName={styles.legend}
            backgroundColor="transparent"
          />
        </section>
      </Card>
    );
  }

  componentDidMount() {
    if (this.props.width === '100%') {
      window.addEventListener('resize', this._handleResize);
    }
    this._handleResize();
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
