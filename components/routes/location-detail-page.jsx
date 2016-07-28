import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Card from '../card';
import Breadcrumbs from '../layout/breadcrumbs';
import LocationCard from '../locations/location-details-card';
import NotificationsCard from '../locations/notifications-card';
import EnergySummaryCard from '../services/energy-summary-card';
import SpaceManagementSummaryCard from '../services/space-management-summary-card';
import SectionsCard from '../locations/sections-card';
import api from '../../lib/api';
import styles from './location-detail-page.scss';
const { BASE_URL } = process.env;

export default class LocationDetailPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object,
    customer: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    // keep track of requests
    this._promises = [];

    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      sections: [],
      summary: {},
      isGettingPlatformError: false,
      contact: {}
    };
  }

  render() {
    const { params } = this.props;
    const { customerId, locationId } = params;
    const { customer, location, sections, summary, contact } = this.state;
    const customerName = customer.name || '';
    const locationName = location.name || '';
    const address = [location.street, location.city].join(', ');
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customerName, href: `${BASE_URL}/customers/${customerId}` },
      { name: `${locationName} - ${address}`, href: `${BASE_URL}/customers/${customerId}/locations/${locationId}` }
    ];
    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row),
      column: cx('col-xs-4 col-sm-4', styles.column),
      notifications: cx('col-xs-5 col-sm-5', styles.notifications),
      service: cx('row', styles.service),
      section: cx('row', styles.section)
    };

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <div className={classNames.container}>
        <div className={classNames.row}>
          <div className="col-xs-7 col-sm-7">
            <LocationCard
              {...location}
              contact={contact}
              customer={customer}
              photoUrl={location.photoUrl}
            />
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

        {sections.length > 0 &&
        <div className={classNames.row}>
          <div className="col-xs-12">
            <SectionsCard sections={sections} onSectionClick={this._handleSectionClick} />
          </div>
        </div>}
      </div>

    </Page>);
  }

  componentDidMount() {
    const { params, customer } = this.props;
    const { customerId, locationId } = params;

    if (!customer) {
      api.get(`/customers/${customerId}`)
        .then(res => {
          this.setState({ customer: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    api.get(`/locations/${locationId}`)
      .then(res => {
        this.setState({ location: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/locations/${locationId}/sections`)
      .then(res => {
        this.setState({ sections: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/customers/${customerId}/contacts`)
      .then(res => {
        this.setState({ contact: res.body[0] });
      })
      .catch(error => {
        console.log(error);
      });

    this._getData(locationId);
  }

  // If there's platform error then stop polling
  componentWillUpdate(nextProps, nextState) {
    const { locationId } = this.props.params;
    const DELAY = 5000;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (!nextState.isGettingPlatformError) {
      this.timeoutId = setTimeout(() => {
        this._getData(locationId);
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

  _handleSectionClick = ({ customerId, locationId, id }) => {
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${customerId}/locations/${locationId}/sections/${id}`);
  };

  _handleEnergySummaryClick = () => {
    const { customerId, locationId } = this.props.params;
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${customerId}/locations/${locationId}/energy`);
  };

  _handleSpaceSummaryClick = () => {
    const { customerId, locationId } = this.props.params;
    const { router } = this.context;
    router.push(`${BASE_URL}/customers/${customerId}/locations/${locationId}/space`);
  };

  _getData = (locationId) => {
    const req = api.get(`/ts/locations/${locationId}/summary`);

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
