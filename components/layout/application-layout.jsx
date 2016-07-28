import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import SideMenu from './side-menu';
import MainMenuIcon from '../icons/main-menu-icon';
import ProfileModal from '../modals/profile-modal';
import { imagePath } from '../../lib/utils';
import styles from './application-layout.scss';
const { COMPANY } = process.env;

export default class ApplicationLayout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array, PropTypes.object
    ])
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isProfileModalOpen: false,
      isSideMenuOpen: false,
      activePage: undefined,
      user: localStorage.user
          ? JSON.parse(localStorage.user)
          : null
    };
  }

  render() {
    const { isSideMenuOpen, isProfileModalOpen, user } = this.state;

    const style = {
      transform: `translate3d(${isSideMenuOpen ? '235px' : 0}, 0, 0)`
    };

    return (<div className={styles.body}>
      <SideMenu
        user={user}
        onNavigate={this._handleBodyClick}
        onProfileClick={this._handleProfileClick}
      />

      <div
        className={styles['app-content']}
        style={style}
        onClick={isSideMenuOpen ? this._handleBodyClick : undefined}
      >
        <div className={styles.header}>
          <span onClick={this._toggleSideMenu}>
            <MainMenuIcon className={styles.icon} />
          </span>
          <img className={styles.logo} src={imagePath(`/images/${COMPANY}/logo.png`)} />
        </div>

        {this.props.children}

      </div>

      {isProfileModalOpen &&
        <ProfileModal
          user={user}
          onCancelClick={this._handleHideProfileModal}
          onProfileUpdate={this._handleProfileUpdate}
        />
      }
    </div>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleProfileClick = () => {
    this.setState({
      isSideMenuOpen: true,
      isProfileModalOpen: !this.state._isProfileClicked
    });
  };

  _handleBodyClick = () => {
    this.setState({ isSideMenuOpen: false });
  };

  _handleHideProfileModal = () => {
    this.setState({
      isProfileModalOpen: false
    });
  };

  _handleProfileUpdate = (updatedUser) => {
    this.setState({
      isProfileModalOpen: false,
      user: updatedUser
    });
  };

  _toggleSideMenu = () => {
    this.setState({
      isSideMenuOpen: !this.state.isSideMenuOpen
    });
  };
}
