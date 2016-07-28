import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { imagePath } from '../../lib/utils';
import Page from '../page';
import Card from '../card';
import Breadcrumbs from '../layout/breadcrumbs';
import LineChartIcon from '../icons/line-chart-icon';
import EnergySummaryCard from '../services/energy-summary-card';
import EnergyChartCard from '../services/energy-chart-card';
import EnergyFootprintChartCard from '../services/energy-footprint-chart-card';
import api from '../../lib/api';
import styles from './energy-services-page.scss';
import ManageUtilityModal from '../services/manage-utility-modal';

const { BASE_URL } = process.env;
const PIE_CHART_DATA = [
  {
    name: 'CO2',
    footprint: 23.4
  },
  {
    name: 'SO2',
    footprint: 14.1
  },
  {
    name: 'NOX',
    footprint: 16
  }
];

export default class EnergyServicesPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    theme: PropTypes.object
  };

  static propTypes = {
    params: PropTypes.object,
    customer: PropTypes.object,
    location: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this._promises = {};

    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      chartData: [],
      isUtilityModalOpen: false,
      summary: {},
      isGettingPlatformError: false
    };
  }

  render() {
    const { theme } = this.context;
    const { customerId, locationId } = this.props.params;
    const { customer, location, chartData, isUtilityModalOpen, summary } = this.state;
    const customerName = customer.name || '';
    const locationName = location.name || '';
    const address = [location.street, location.city].join(', ');
    const classNames = {
      link: cx(styles.link, theme.link),
      container: cx('container', styles.container),
      row: cx('row', styles.row),
      column: cx('col-xs-4 col-sm-4', styles.column)
    };

    const utilityManageStyle = {
      display: isUtilityModalOpen ? 'block' : 'none'
    };

    let breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customerName, href: `${BASE_URL}/customers/${customerId}` }
    ];
    if (!locationId) {
      breadcrumbs.push({
        name: 'Energy Service Details',
        href: `${BASE_URL}/customers/${customerId}/energy`
      });
    } else {
      breadcrumbs.push({
        name: `${locationName} - ${address}`,
        href: `${BASE_URL}/customers/${customerId}/locations/${locationId}`
      });
      breadcrumbs.push({
        name: 'Energy Service Details',
        href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/energy`
      });
    }

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <div className={classNames.container}>
        <Card
          headerText="Energy Service Details"
        >
          <section className={styles.wrapper}>
            <div className={classNames.row}>
              <div className={classNames.column}>
                <EnergySummaryCard data={chartData} summary={summary}/>
              </div>
              <div className={classNames.column}>
                <EnergyFootprintChartCard data={PIE_CHART_DATA} />
              </div>
              <div className={classNames.column}>
                <Card
                  headerIcon={<LineChartIcon />}
                  headerText="Utility"
                  className={styles.card}
                >
                  <div className={styles['utility-container']}>
                    <img
                      src={imagePath('/images/eon-logo.png')}
                      className={styles.logo}
                    />
                    <div className={classNames.link}>
                      <span onClick={this._handleUtilityClick}>
                        Manage Utility Plan
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className={classNames.row}>
              <div className="col-xs-12">
                <EnergyChartCard data={chartData} />
              </div>
            </div>
          </section>
        </Card>
      </div>

      <div style={utilityManageStyle}>
        <ManageUtilityModal
          onCloseClick={this._handleUtilityClose}
        />
      </div>
    </Page>);
  }

  componentDidMount() {
    const { params } = this.props;
    const { customerId, locationId } = params;

    if (customerId) {
      api.get(`/customers/${customerId}`)
        .then(res => {
          this.setState({ customer: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (locationId) {
      api.get(`/locations/${locationId}`)
        .then(res => {
          this.setState({ location: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    this._getSummaryData(customerId, locationId);
    this._getEnergyData(customerId, locationId);
  }

  // If there's platform error then stop polling
  componentWillUpdate(nextProps, nextState) {
    const { customerId, locationId } = this.props.params;
    const DELAY = 5000;

    if (this.summaryTimeoutId) {
      clearTimeout(this.summaryTimeoutId);
    }

    if (this.energyTimeoutId) {
      clearTimeout(this.energyTimeoutId);
    }

    if (!nextState.isGettingPlatformError) {
      this.summaryTimeoutId = setTimeout(() => {
        this._getSummaryData(customerId, locationId);
      }, DELAY);

      this.energyTimeoutId = setTimeout(() => {
        this._getEnergyData(customerId, locationId);
      }, DELAY);
    }
  }

  componentWillUnmount() {
    if (this.summaryTimeoutId) {
      clearTimeout(this.summaryTimeoutId);
    }

    if (this.energyTimeoutId) {
      clearTimeout(this.energyTimeoutId);
    }

    if (this._promises.summaryReq) {
      this._promises.summaryReq.cancel();
      delete this._promises.summaryReq;
    }

    if (this._promises.energyReq) {
      this._promises.energyReq.cancel();
      delete this._promises.energyReq;
    }

    this._promises = undefined;
    delete this._promises;
  }

  _handleUtilityClick = () => {
    this.setState({ isUtilityModalOpen: true });
  };

  _handleUtilityClose = () => {
    this.setState({ isUtilityModalOpen: false });
  };

  _getSummaryData = (customerId, locationId) => {
    const endpoint = locationId
            ? `/ts/locations/${locationId}/summary`
            : `/ts/customers/${customerId}/summary`;
    const req = api.get(endpoint);

    this._promises.summaryReq = req;

    req.then(res => {
      this.setState({ summary: res.body });
    }).catch(error => {
      console.log(error);
      this.setState({ isGettingPlatformError: true });
    }).finally(() => {
      if (this._promises) {
        this._promises.summaryReq = undefined;
      }
    });
  };

  _getEnergyData = (customerId, locationId) => {
    const endpoint = locationId
                   ? `/ts/locations/${locationId}`
                   : `/ts/customers/${customerId}`;

    const req = api.get(`${endpoint}?type=ENERGY_AGGREGATE&filter=DAY`);

    this._promises.energyReq = req;

    req.then(res => {
      this.setState({ chartData: res.body });
    }).catch(error => {
      console.log(error);
      this.setState({ isGettingPlatformError: true });
    }).finally(() => {
      if (this._promises) {
        this._promises.energyReq = undefined;
      }
    });
  };
}
