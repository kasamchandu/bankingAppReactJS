import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './server-unprovisioning-modal.scss';
import Modal from '../modal.jsx';

export default class CheckUpdatesModal extends Component {
  static propTypes = {
    onCloseClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  render() {
    const { theme } = this.context;
    const classNames = {
      cancel: cx('btn', styles['cancel-btn']),
      save: cx('btn', styles['save-btn'], theme['btn-primary']),
    };

    return (
      <Modal headerText="Unprovision Server">
        <div className={styles.container}>
          <div className={styles['unprovision-content']}>
            Do you want to unprovision this server?
          </div>
          <div className={styles['btn-container']}>
            <button
              type="button"
              className={classNames.cancel}
              onClick={this._handleCloseClick}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={classNames.save}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  _handleCloseClick = () => {
    const { onCloseClick } = this.props;
    if (onCloseClick) onCloseClick();
  };
}
