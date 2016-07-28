import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Fuse from 'fuse.js';
import Location from './location';
import SearchIcon from '../icons/search-icon';
import styles from './locations-list.scss';

export default class LocationsList extends Component {
  static propTypes = {
    locations: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      filteredLocations: props.locations || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filteredLocations: nextProps.locations || []
    });
  }

  render() {
    const { locations, className, style } = this.props;
    const { filteredLocations } = this.state;
    const classNames = {
      container: classnames(styles.container, className)
    };

    return <div className={classNames.container} style={style}>
      <div className={styles['search-box']}>
        <SearchIcon className={styles['search-icon']}/>
        <input type="text"
          className={styles['search-field']}
          onChange={this._handleSearchTextChange}
        />
      </div>
      <ul className={styles.locations}>
        {filteredLocations.map((location, index) => {
          return <li key={index} onClick={this._handleLocationClick.bind(this, location.id)}>
            <Location {...location} />
          </li>;
        }, this)}
      </ul>
    </div>;
  }

  _handleSearchTextChange = (e) => {
    const searchTerm = e.target.value;
    const { locations } = this.props;
    const options = {
      keys: ['name', 'street', 'city']
    };

    if (searchTerm.length) {
      if (locations.length) {
        const fuzzy = new Fuse(locations, options);
        this.setState({
          searchText: searchTerm,
          filteredLocations: fuzzy.search(searchTerm)
        })
      } else {
        this.setState({
          searchText: searchTerm
        });
      }
    } else {
      this.setState({
        searchText: searchTerm,
        filteredLocations: locations
      });
    }

  };

  _handleLocationClick = (locationId) => {
    this.props.onLocationClick && this.props.onLocationClick(locationId);
  };
}
