import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../card';
import { Link } from 'react-router';
import Img from '../img';
import { formatDate, fullName, imagePath } from '../../lib/utils';
import styles from './location-details-card.scss';
const { BASE_URL, COMPANY } = process.env;

export default class LocationCard extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    photoUrl: PropTypes.string,
    customer: PropTypes.object,
    contact: PropTypes.object,
    installDate: PropTypes.string,
    lastServiceDate: PropTypes.string,
    floorCount: PropTypes.number,
    sectionCount: PropTypes.number,
    serverCount: PropTypes.number,
    deviceCount: PropTypes.number
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  static defaultProps = {
    floorCount: 0,
    sectionCount: 0,
    serverCount: 0,
    deviceCount: 0
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.context;
    const {
      id,
      name,
      street,
      city,
      state,
      zip,
      photoUrl,
      customer,
      contact,
      installDate,
      lastServiceDate,
      floorCount,
      sectionCount,
      serverCount,
      deviceCount
    } = this.props;
    const classNames = {
      address: cx(styles.address, theme.link),
      link: cx(styles.link, theme.link),
      contactEmail: cx(styles['contact-email'], theme.link)
    };

    return (
      <Card className={styles.card} headerText="Location Details">
        <div className={styles['card-content']}>
          <div className={styles['location-container']}>
            <Img
              className={styles.image}
              src={photoUrl}
              defaultSrc={imagePath('/images/default-company.jpg')}
              useBackground
            />

            <div className={styles['location-content']}>
              <div className={styles['address-block']}>
                <h2 className={styles.name}>{name}</h2>
                <div className={classNames.address}>
                  {street ? street + ',' : ''}<br />
                  {`${city || ''} ${state|| ''} ${zip|| ''}`}
                </div>
              </div>
              <div className={styles['location-detail']}>
                <ul className={styles.stats}>
                  <li>Floors: {floorCount}</li>
                  <li>Sections: {sectionCount}</li>
                  <li>Servers: {serverCount}</li>
                  <li>Devices: {deviceCount}</li>
                </ul>
                <div className={styles.dates}>
                  <div>Install Date: {formatDate(new Date(installDate))}</div>
                  <div>Last Service: {formatDate(new Date(lastServiceDate))}</div>
                  {serverCount > 0 &&
                  <Link
                    to={`${BASE_URL}/customers/${customer.id}/locations/${id}/servers`}
                    className={classNames.link}>
                    Manage Infrastructure
                  </Link>}
                </div>
              </div>
            </div>
          </div>

          <hr className={styles.hr} />
          {contact &&
          <section>
            <header>
              <h4 className={styles['contact-header']}>Primary Contact</h4>
            </header>

            <div className={styles.contact}>
              <Img
                className={styles['contact-image']}
                src={contact.photoUrl}
                defaultSrc={imagePath(`/images/${COMPANY}/profile.png`)}
                useBackground
              />

              <div className={styles['contact-info']}>
                <h5 className={styles['contact-name']}>{fullName(contact)}</h5>
                <a className={classNames.contactEmail}>
                  {contact.email}
                </a>
                <label className={styles['contact-phone']}>{contact.phone}</label>
              </div>
            </div>
          </section>}
        </div>
      </Card>
    );
  }
}
