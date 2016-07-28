import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Breadcrumbs from '../layout/breadcrumbs';
import LocationDetailsCard from '../servers/location-details-card';
import ServersListCard from '../servers/servers-list-card';
import ServerDetailsCard from '../servers/server-details-card';
import CheckUpdateModal from '../servers/check-updates-modal';
import api from '../../lib/api';
import styles from './server-page.scss';
const { BASE_URL } = process.env;

export default class ServerPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      servers: [],
      server: {},
      serverLocation: {},
      selectedServer: {},
      isUpdatesModalOpen: false
    };
  }

  render() {
    const { customerId, locationId } = this.props.params;
    const { customer, location, selectedServer } = this.state;
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customer.name || '', href: `${BASE_URL}/customers/${customerId}` },
      { name: `${location.name || ''} - ${location.street || ''}, ${location.city || ''}`, href: `${BASE_URL}/customers/${customerId}/locations/${locationId}` },
      { name: 'Manage Infrastructure', href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/servers` }
    ];
    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row)
    };
    const { isUpdatesModalOpen } = this.state;
    const checkUpdateStyle = {
      display: isUpdatesModalOpen ? 'block' : 'none'
    };

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <div>
        <div style={checkUpdateStyle}>
         <CheckUpdateModal onCloseClick={this._handleCheckUpdatesClose} />
        </div>
        <div className={classNames.container}>
          <div className={classNames.row}>
            <div className="col-xs-12">
              <LocationDetailsCard
                onCheckUpdateClick={this._handleCheckUpdatesClick}
                location={location}
              />
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12" >
              <ServersListCard
                onItemClick={this._handleServerClick}
                onItemDeviceClick={this._handleDeviceClick}
                servers={this.state.servers}
              />
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12">
              <ServerDetailsCard server={selectedServer} />
            </div>
          </div>
        </div>
      </div>
    </Page>);
  }

  componentDidMount() {
    const { customerId, locationId } = this.props.params;
    if (!this.props.customer) {
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

    api.get(`/locations/${locationId}/servers`)
      .then(res => {
        if (res && res.body && res.body.length) {
          this.setState({
            servers: res.body,
            selectedServer: res.body[0]
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _handleServerClick = (serverId) => {
    const { servers } = this.state;
    const serverLength = servers.length;

    for (let i = 0; i < serverLength; i++) {
      if (servers[i].id === serverId) {
        this.setState({
          selectedServer: servers[i]
        });
        break;
      }
    }
  };

  _handleDeviceClick = (serverId) => {
    const { params } = this.props;
    const { router } = this.context;
    router.push(
      `${BASE_URL}/customers/${params.customerId}/locations/${params.locationId}/servers/${serverId}`
    );
  };

  _handleCheckUpdatesClose = () => {
    this.setState({ isUpdatesModalOpen: false });
  };

  _handleCheckUpdatesClick = () => {
    this.setState({ isUpdatesModalOpen: true });
  };
}
