import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Breadcrumbs from '../layout/breadcrumbs';
import api from '../../lib/api';
import ServerDetailsCard from '../server-details/server-details-card';
import DevicesCard from '../server-details/devices-card';
import DeviceDetailCard from '../server-details/device-detail-card';
import ResourcesCard from '../server-details/resources-card';
import styles from './server-detail-page.scss';
const { BASE_URL } = process.env;

export default class ServerDetailPage extends Component {
  static propTypes = {
    params: PropTypes.object,
    customer: PropTypes.object,
    location: PropTypes.object,
    server: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      servers: [],
      server: props.server,
      devices: [],
      device: null,
      selectedDevice: null
    };
  }

  render() {
    const { customerId, locationId, serverId } = this.props.params;
    const { customer, location, server, selectedDevice, devices } = this.state;
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customer.name || '', href: `${BASE_URL}/customers/${customerId}` },
      { name: `${location.name || ''} - ${location.street || ''}, ${location.city || ''}`, href: `${BASE_URL}/customers/${customerId}/locations/${locationId}` },
      { name: 'Manage Infrastructure', href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/servers` },
      { name: server && server.name ? server.name : '', href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/servers/${serverId}` }
    ];
    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row)
    };

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <div>
        <div className={classNames.container}>
          <div className={classNames.row}>
            <div className="col-xs-12">
              {server && <ServerDetailsCard server={server} />}
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12" >
              {devices.length > 0 &&
              <DevicesCard
                onItemClick={this._handleDeviceClick}
                devices={devices}
              />}
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12">
              {selectedDevice && <DeviceDetailCard device={selectedDevice}/>}
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12">
              {selectedDevice && selectedDevice.capabilities &&
                <ResourcesCard
                  device={selectedDevice}
                  onReadBtnClick={this._handleDeviceClick}
                  onToggleClick={this._handleToggleClick}
                  onIdentifyClick={this._handleIdentifyClick}
                />}
            </div>
          </div>

        </div>
      </div>
    </Page>);
  }

  componentDidMount() {
    const { customerId, locationId, serverId } = this.props.params;
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

    api.get(`/servers/${serverId}`)
      .then(res => {
        this.setState({ server: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/servers/${serverId}/devices`)
      .then(res => {
        const devicesArray = res.body;
        const selectedDevice = res.body[0];

        this.setState({
          devices: devicesArray,
          selectedDevice
        });

        if (selectedDevice) {
          return api.get(`/devices/${selectedDevice.id}`);
        }
      })
      .then(response => {
        this.setState({ selectedDevice: response.body });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _handleDeviceClick = (deviceId) => {
    const { devices } = this.state;
    const deviceLength = devices.length;

    for (let i = 0; i < deviceLength; i++) {
      if (devices[i].id === deviceId) {
        this.setState({ selectedDevice: devices[i] });
        break;
      }
    }

    api.get(`/devices/${deviceId}`)
      .then(res => {
        this.setState({ selectedDevice: res.body });
      })
      .catch(error => {
        console.log(error);
      });
  };

  _handleToggleClick = (deviceId, status) => {
    api.put(`/devices/${deviceId}/capabilities/LIGHT`, { on: !status })
      .then(res => {
        if (res) {
          return api.get(`/devices/${deviceId}`);
        }
      })
      .then(response => {
        this.setState({ selectedDevice: response.body });
      })
      .catch(err => {
        console.log(err);
      });
  };

  _handleIdentifyClick = (deviceId) => {
    api.post(`/devices/${deviceId}/capabilities/IDENTIFY/flash`)
      .then(res => {
        this.setState({ device: res.body });
      })
      .catch(error => {
        console.log(error);
      });
  };
}
