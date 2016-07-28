import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import GoogleMap from 'google-map-react';
import MapMarker from './map-marker';
import { computeLatLngBound } from '../../lib/utils';
import { fitBounds } from 'google-map-react/utils';

const DEFAULT_CENTER = { lat: 37.782159, lng: -122.400484 };
const DEFAULT_ZOOM = 15;

export default class Map extends Component {
  static propTypes = {
    locations: PropTypes.array,
    shouldUpdate: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    params: PropTypes.object
  };

  static defaultProps = {
    locations: []
  };

  constructor(props) {
    super(props);

    this.state = {
      center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      zoom: DEFAULT_ZOOM
    };
  }

  render() {
    const { locations } = this.props;
    const { center, zoom } = this.state;
    const filteredLocations = locations.filter(
      ({ latitude, longitude }) => (latitude && longitude)
    );

    return (
      <GoogleMap ref="map"
        bootstrapURLKeys={{
          key: 'AIzaSyAJyKB7tRllSAs16S_HKSLqvSo481bOlqw'
        }}
        center={center}
        zoom={zoom}
        hoverDistance={40}
        onChange={this._onMapChange}
        onCenterChange={this._onMapCenterChange}
      >
        {filteredLocations.map(loc => (
          <MapMarker
            onClick={this._handleLocationClick.bind(this, loc.id)}
            key={loc.id}
            lat={loc.latitude}
            lng={loc.longitude}
            {...loc}
          />
        ))}
      </GoogleMap>
    );
  }

  componentDidMount() {
    const { locations } = this.props;
    const filteredLocations = locations.filter(({ latitude, longitude }) => latitude && longitude);
    const bounds = computeLatLngBound(filteredLocations);
    const $map = ReactDOM.findDOMNode(this.refs.map);

    const size = {
      width: $map.offsetWidth,
      height: $map.offsetHeight,
    };

    // set center and zoom
    if (filteredLocations.length > 0) {
      if (filteredLocations.length === 1) {
        const loc = filteredLocations[0];
        this.setState({
          center: { lat: loc.latitude, lng: loc.longitude }
        });
      } else {
        this.setState(fitBounds(bounds, size));
      }
    }
  }

  _onMapChange = ({ center, zoom }) => {
    console.log('_onMapChange', center, zoom);
  };

  _onMapCenterChange = () => {
    console.log('onMapCenterChange', arguments);
  };

  _handleLocationClick = (locationId) => {
    this.props.onLocationClick && this.props.onLocationClick(locationId);
  };
}
