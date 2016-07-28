import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Card from '../card';
import Breadcrumbs from '../layout/breadcrumbs';
import AllLocationsCard from '../locations/all-locations-card';
import NotificationsCard from '../locations/notifications-card';
import EnergySummaryCard from '../services/energy-summary-card';
import SpaceManagementSummaryCard from '../services/space-management-summary-card';
import api from '../../lib/api';
import styles from './customer-detail-page.scss';
const { BASE_URL } = process.env;

export default class CustomerDetailPage extends Component {
  static propTypes = {
    params: PropTypes.object,
    customer: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // keep track of requests
    this._promises = [];

    this.state = {
      locations: [],
      customer: props.customer || {},
      summary: {},
      isGettingPlatformError: false
    };
  }

  render() {
    const { customerId } = this.props.params;
    const { customer, locations, summary } = this.state;
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customer.name || '', href: `${BASE_URL}/customers/${customerId}` }
    ];
    const classNames = {
      container: cx('container', styles.container),
      notifications: cx('col-sm-5 col-xs-5', styles.notifications),
      row: cx('row', styles.row),
      column: cx('col-xs-4 col-sm-4', styles.column)
    };

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <div>
        <div className={classNames.container}>
          <div className={classNames.row}>
            <div className="col-sm-7 col-xs-7">
              <AllLocationsCard locations={locations} onLocationClick={this._handleLocationClick} />
            </div>

            <div className={classNames.notifications}>
              <NotificationsCard />
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12">
              <Card headerText="Services">
                <div className={classNames.row}>
                  <div className={classNames.column}>
                    <EnergySummaryCard
                      onClick={this._handleEnergySummaryClick}
                      summary={summary}
                    />
                  </div>

                  <div className={classNames.column}>
                    <SpaceManagementSummaryCard
                      onClick={this._handleSpaceSummaryClick}
                      summary={summary}
                    />
                  </div>

                  <div className={classNames.column}>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Page>);
  }

  componentDidMount() {
    const { customerId } = this.props.params;
    if (!this.props.customer) {
      api.get(`/customers/${customerId}`)
        .then(res => {
          this.setState({ customer: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    api.get(`/customers/${customerId}/locations`)
      .then(res => {
        this.setState({ locations: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    this._getData(customerId);
  }

  // If there's platform error then stop polling
  componentWillUpdate(nextProps, nextState) {
    const DELAY = 5000;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (!nextState.isGettingPlatformError) {
      this.timeoutId = setTimeout(() => {
        this._getData(this.props.params.customerId);
      }, DELAY);
    }
  }

  componentWillUnmount() {
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

  _handleLocationClick = (locationId) => {
    const { params } = this.props;
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${params.customerId}/locations/${locationId}`);
  };

  _handleEnergySummaryClick = () => {
    const { params } = this.props;
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${params.customerId}/energy`);
  };

  _handleSpaceSummaryClick = () => {
    const { params } = this.props;
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${params.customerId}/space`);
  };

  _getData = (customerId) => {
    const req = api.get(`/ts/customers/${customerId}/summary`);

    this._promises.push(req);

    req.then(res => {
      this.setState({ summary: res.body });
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
