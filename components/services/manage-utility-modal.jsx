import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './manage-utility-modal.scss';
import Modal from '../modal.jsx';

export default class ManageUtilityModal extends Component {
  static propTypes = {
    onCloseClick: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  render() {
    const { theme } = this.context;
    const btnStyle = cx('btn', styles['close-btn'], theme['btn-primary']);

    return (
      <Modal headerText="Check for Updates">
        <div className={styles.container}>
          <div className={styles['updates-content']}>
            Your location is not currently set up with a utility account.
          </div>
          <div className={styles['btn-wrapper']}>
            <button
              type="button"
              className={btnStyle}
              onClick={this._handleCloseClick}
            >
              Close
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
