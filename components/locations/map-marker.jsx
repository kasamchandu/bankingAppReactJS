import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import MapPinIcon from '../icons/map-pin-icon';
import styles from './map-marker.scss';

export default class MapMarker extends Component {
  static propTypes = {
    $hover: PropTypes.bool,
    name: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { $hover, name, street, city, style } = this.props;
    const address = [street, city]
                    .filter(val => val)
                    .join(', ');
    const classNames = {
      marker: cx('hint hint--html hint--info hint--top', styles.marker),
      pin: $hover ? styles.active : styles.pin,
      hint: $hover ? styles['hint-active'] : styles.hint
    };

    return <div className={classNames.marker} style={style} onClick={this._handleClick}>
      <MapPinIcon className={classNames.pin} />
      <div className={classNames.hint}>
        <div className={styles.name}>{name}</div>
        <div className={styles.address}>{address}</div>
      </div>
    </div>;
  }

  _handleClick = (e) => {
    e.preventDefault();
    this.props.onClick && this.props.onClick(this.props);
  };
}
