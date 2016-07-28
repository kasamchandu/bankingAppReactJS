import React, { Component } from 'react';
import cx from 'classnames';
import Page from '../page';
import api from '../../lib/api';
import Breadcrumbs from '../layout/breadcrumbs';
import SectionDetailsCard from '../sections/section-details-card';
import DevicesCard from '../sections/devices-card';
import CommissioningDetailsCard from '../sections/commissioning-details-card';
import styles from './section-detail-page.scss';
const { BASE_URL } = process.env;

export default class SectionDetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      devices: [],
      section: {},
      recipes: [],
      groups: [],
      scenes: []
    };
  }

  render() {
    const { customerId, locationId, sectionId } = this.props.params;
    const { customer, location, section, devices, recipes, groups, scenes } = this.state;
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customer.name || '', href: `${BASE_URL}/customers/${customerId}` },
      { name: `${location.name || ''} - ${location.street || ''}, ${location.city || ''}`, href: `${BASE_URL}/customers/${customerId}/locations/${locationId}` },
      { name: 'Manage Office', href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/sections/${sectionId}` }
    ];
    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row),
      devices: cx('col-xs-5 col-sm-5', styles.devices)
    };

    return <Page>
      <Breadcrumbs links={breadcrumbs} />

      <div>
        <div className={classNames.container}>
          <div className={classNames.row}>
            <div className="col-xs-7 col-sm-7">
              <SectionDetailsCard section={section} devices={devices} />
            </div>

            <div className={classNames.devices}>
              <DevicesCard devices={devices} />
            </div>
          </div>

          <div className={classNames.row}>
            <div className="col-xs-12">
              <CommissioningDetailsCard recipes={recipes} groups={groups} scenes={scenes} />
            </div>
          </div>
        </div>
      </div>
    </Page>;
  }

  componentDidMount() {
    const { customerId, locationId, sectionId } = this.props.params;
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

    api.get(`/sections/${sectionId}`)
      .then(res => {
        this.setState({ section: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/sections/${sectionId}/devices`)
      .then(res => {
        this.setState({ devices: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/sections/${sectionId}/recipes`)
      .then(res => {
        this.setState({ recipes: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/sections/${sectionId}/groups`)
      .then(res => {
        this.setState({ groups: res.body });
      })
      .catch(error => {
        console.log(error);
      });

    api.get(`/sections/${sectionId}/scenes`)
      .then(res => {
        this.setState({ scenes: res.body });
      })
      .catch(error => {
        console.log(error);
      });
  }
}
