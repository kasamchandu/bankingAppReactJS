import React, { Component, PropTypes } from 'react';
import Card from '../card';
import LocationsList from './locations-list';
import GoogleMap from './map';
import MapIcon from '../icons/map-icon';
import ListIcon from '../icons/list-icon';
import styles from './all-locations-card.scss';

export default class AllLocationsCard extends Component {
  static propTypes = {
    locations: PropTypes.array,
    onLocationClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'list'
    };
  }

  render() {
    const { locations, onLocationClick } = this.props;
    const { activeTab } = this.state;
    const tabStyles = {
      list: {
        display: activeTab === 'list' ? 'flex' : 'none'
      },
      map: {
        display: activeTab === 'map' ? 'flex' : 'none'
      }
    };

    return (
      <Card
        className={styles['location-container']}
        headerText="All Locations"
        action={
          <div>
            <span className={styles['title-view-by']}>View by </span>
            <button type="button"
              className={styles['header-btn']}
              onClick={this._showListView}
            >
              <ListIcon selected={activeTab === 'list'} />
            </button>
            <button
              type="button"
              className={styles['header-btn']}
              onClick={this._showMapView}
            >
              <MapIcon selected={activeTab === 'map'} />
            </button>
          </div>
        }
      >

        <div className={styles.container} style={tabStyles.list}>
          <LocationsList
            locations={locations}
            onLocationClick={onLocationClick}
          />
        </div>
        <div className={styles.container} style={tabStyles.map}>
          {activeTab === 'map' && <GoogleMap locations={locations} onLocationClick={onLocationClick}/>}
        </div>
      </Card>
    );
  }

  _showListView = () => {
    this.setState({ activeTab: 'list' });
  };

  _showMapView = () => {
    this.setState({ activeTab: 'map' });
  };
}
