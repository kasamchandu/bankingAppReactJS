import React, { Component, PropTypes } from 'react';
import Card from '../card';
import EditIcon from '../icons/edit-icon';
import Img from '../img';
import { imagePath } from '../../lib/utils';
import styles from './customer-card.scss';

export default class CustomerCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    webpage: PropTypes.string,
    photoUrl: PropTypes.string,
    updateDate: PropTypes.string,
    onHeaderClick: PropTypes.func,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { name, photoUrl, updateDate } = this.props;
    const src = photoUrl
            ? `${photoUrl}?${updateDate || ''}`
            : undefined;

    return (
      <Card
        className={styles.card}
        headerText={name}
        action={
          <span
            className={styles.edit}
            onClick={this._handleEditIconClick}
          >
            <EditIcon />
          </span>
        }
      >

        <div className={styles.container} onClick={this._handleBodyClick}>
          <Img
            className={styles.logo}
            src={src}
            defaultSrc={imagePath('/images/default-company.jpg')}
            alt={name}
            useBackground
          />
        </div>

      </Card>
    );
  }

  _handleEditIconClick = () => {
    const { id, onHeaderClick } = this.props;

    if (onHeaderClick) onHeaderClick(id);
  };

  _handleBodyClick = () => {
    const { id, onClick } = this.props;

    if (onClick) onClick(id);
  };
}
