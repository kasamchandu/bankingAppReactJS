import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';
import api from '../../lib/api';
import auth from '../../lib/auth';
import { fullName, imagePath } from '../../lib/utils';
import Img from '../img';
import styles from './side-menu.scss';
const { BASE_URL, VERSION, COMPANY } = process.env;

export default class SideMenu extends Component {
  static propTypes = {
    user: PropTypes.object,
    activePage: PropTypes.string,
    onNavigate: PropTypes.func,
    onProfileClick: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    theme: PropTypes.object
  };

  static defaultProps = {
    activePage: undefined
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { theme } = this.context;
    const { user, onNavigate } = this.props;
    const name = fullName(user);

    const classNames = {
      header: cx(styles['profile-container'], theme['side-menu--profile']),
      list: cx('list-group', styles['menu-list']),
      listItem: cx('list-group-item', styles['menu-item']),
      link: cx(styles.link, theme['side-menu--link']),
      logout: cx('btn', styles['logout-btn'], theme['btn-primary'])
    };
    const version = `v${VERSION}`;
    const userPhotoUrl = user.photoUrl && user.updateDate
                       ? `${user.photoUrl}?${user.updateDate}`
                       : user.photoUrl;

    return (<div className={styles['side-menu']}>
      <div className={styles['menu-container']}>
        <Link to={BASE_URL || '/'}>
          <div onClick={this._handleProfileClick} className={classNames.header}>
            <div>
              <Img
                className={styles['profile-image']}
                src={userPhotoUrl}
                defaultSrc={imagePath('/images/profile.png')}
                useBackground
              />
            </div>
            <div className={styles.name}>
              {name}
            </div>
            <div className={styles.email}>
              {(user && user.email) ? user.email : ''}
            </div>
          </div>
        </Link>
        <div className={styles.menu}>
          <ul className={classNames.list}>
            <li className={classNames.listItem}>
              <Link to={BASE_URL || '/'} className={classNames.link} onClick={onNavigate}>
                Homepage
              </Link>
            </li>
            <li className={classNames.listItem}>
              <Link
                to={`${BASE_URL}/customers/new`}
                className={classNames.link}
                onClick={onNavigate}
              >   
                Add Customer
              </Link>
            </li>
            <li className={classNames.listItem}>
              <Link
                to={`/portal/provisioning`}
                className={classNames.link}
                onClick={onNavigate}
              >
                Server Provisioning
              </Link>
            </li>
          </ul>
          <div className="col-xs-12">
            <button
              type="button"
              className={classNames.logout}
              onClick={this._handleLogoutClick}>
              Log Out
            </button>
          </div>
        </div>
        <div className={styles.version}>
          {version}
        </div>
      </div>
    </div>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleLogoutClick = (e) => {
    e.preventDefault();

    api.logout()
      .then(() => {
        console.log('[Logout successful]');
      })
      .catch(error => {
        console.log('[ERROR] logout', error);
      }).finally(() => {
        auth.expire();
        this.context.router.replace(`${BASE_URL}/login`);
      });
  };

  _handleProfileClick = (e) => {
    e.preventDefault();
    const { onProfileClick } = this.props;
    if (onProfileClick) onProfileClick();
  };
}
