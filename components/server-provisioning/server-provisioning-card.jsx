import React, { Component, PropTypes } from 'react';
import Card from '../card';
import ServersList from './servers-list';
import ProvisionedButtonIcon from '../icons/provisioned-button-icon';
import UnprovisionedButtonIcon from '../icons/unprovisioned-button-icon';
import AddIcon from '../icons/add-icon';
import SearchIcon from '../icons/search-icon';
import styles from './server-provisioning-card.scss';
import ServerUnProvisionModal from './server-unprovisioning-modal';
import ServerProvisionModal from './server-provisioning-modal';

export default class ServerProvisioningCard extends Component {
  static propTypes = {
    locations: PropTypes.array,
    onLocationClick: PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'list',
      isprovisionModalOpen: false,
      isUnProvisionModalOpen: false,
      isPageLoad: true

    };
  }

  render() {
    const { activeTab, isPageLoad, isprovisionModalOpen, isUnProvisionModalOpen } = this.state;
    const tabStyles = {
      list: {
        display: activeTab === 'list' ? 'flex' : 'none'
      },
      map: {
        display: activeTab === 'map' ? 'flex' : 'none'
      }
    };
    const checkProvisionStyle = {
      display: isprovisionModalOpen ? 'block' : 'none'
    };
    const checkUnProvisionStyle = {
      display: isUnProvisionModalOpen ? 'block' : 'none'
    };

    const selectedUnProvision = isPageLoad ? true : activeTab === 'map';
    const selectedProvision = isPageLoad ? true : activeTab === 'list';

    return (
      <Card
        headerText="Servers"
        action={
          <div>
            <span className={styles['title-filter']}>Filter:</span>
            <button type="button"
              className={styles['header-btn']}
              onClick={this._showListView}
            >
              <ProvisionedButtonIcon selected={selectedProvision} />
            </button>
            <button
              type="button"
              className={styles['header-btn']}
              onClick={this._showMapView}
            >
              <UnprovisionedButtonIcon selected={selectedUnProvision} />
            </button>
            <span className={styles['title-add-new']}>Add New </span>
            <button type="button"
              className={styles['header-btn']}
            >
              <AddIcon />
            </button>
          </div>
        }
      >

        <div className={styles.container} style={tabStyles.list}>
          <div className={styles['search-box']}>
            <SearchIcon className={styles['search-icon']}/>
            <input type="text"
              className={styles['search-field']}
            />
          </div>

        <div style={checkUnProvisionStyle}>
          <ServerUnProvisionModal onCloseClick={this._handleUnProvisionClose} />
        </div>
        <div style={checkProvisionStyle}>
          <ServerProvisionModal onCloseClick={this._handleProvisionClose} />
        </div>
          <ServersList activeTab={activeTab} isPageLoad={isPageLoad}
            onProvisionClick={this._handleProvisionClick}
            onUnProvisionClick={this._handleUnProvisionClick}
          />
        </div>
      </Card>
    );
  }

  _handleProvisionClose = () => {
    this.setState({ isprovisionModalOpen: false });
  };

  _handleProvisionClick = () => {
    this.setState({ isprovisionModalOpen: true });
  };

  _handleUnProvisionClose = () => {
    this.setState({ isUnProvisionModalOpen: false });
  };

  _handleUnProvisionClick = () => {
    this.setState({ isUnProvisionModalOpen: true });
  };

  _showListView = () => {
    this.setState({ activeTab: 'list', isPageLoad: false });
  };

  _showMapView = () => {
    this.setState({ activeTab: 'map', isPageLoad: false });
  };
}
