import React, { Component, PropTypes } from 'react';
import Card from '../card';
import Img from '../img';
import { imagePath } from '../../lib/utils';
import styles from './section-card.scss';

export default class SectionCard extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    floor: PropTypes.number,
    customerId: PropTypes.string,
    locationId: PropTypes.string,
    photoUrl: PropTypes.string,
    onClick: PropTypes.func
  };

  render() {
    const { floor, name, photoUrl } = this.props;

    return <Card headerText={`${name}`} headerSubtext={`${floor || '0'}`} className={styles.card}>
      <div className={styles.container} onClick={this._handleClick}>
        <Img
          src={photoUrl}
          defaultSrc={imagePath('/images/ic-generic-map-sm.jpg')}
          className={styles.floorplan}
          useBackground="contain"
        />
      </div>
    </Card>;
  }

  _handleClick = () => {
    this.props.onClick && this.props.onClick(this.props);
  };
}
