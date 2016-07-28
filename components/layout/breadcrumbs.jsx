import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import BreadcrumbIcon from '../icons/breadcrumb-icon';
import styles from './breadcrumbs.scss';

export default class Breadcrumbs extends Component {
  static propTypes = {
    links: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <div className={styles.container}>
      <div className={styles.bar}>
        <BreadcrumbIcon />

        {this.props.links.map((link, index) => {
          return <Link
            key={index}
            to={link.href}
            className={styles.link}
          >
            <span>{link.name}</span>
          </Link>;
        })}
      </div>
    </div>;
  }
}
