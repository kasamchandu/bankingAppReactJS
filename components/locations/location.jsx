import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Img from '../img';
import { imagePath } from '../../lib/utils';
import ChevronRightIcon from '../icons/chevron-right-icon';
import styles from './location.scss';

export default class Location extends Component {
  static propTypes = {
    name: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    photoUrl: PropTypes.string
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const { name, street, city, photoUrl } = this.props;
    const address = [street, city]
                  .filter(val => val)
                  .join(', ');

    return (
      <div className={cx(styles.location, theme.location)}>
        <Img
          className={styles.image}
          src={photoUrl}
          defaultSrc={imagePath('/images/default-company.jpg')}
          useBackground
        />
        <div className={styles.content}>
          {name && <span className={styles.name}>{name}</span>}
          {address && <span className={styles.address}>{address}</span>}
        </div>
        <div className={styles.action}>
          <ChevronRightIcon className={cx(styles.arrow, theme.arrow)} />
        </div>
      </div>
    );
  }
}
