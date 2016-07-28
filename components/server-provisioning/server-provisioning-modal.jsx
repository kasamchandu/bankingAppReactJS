import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import SearchIcon from '../icons/search-icon';
import Modal from '../modal.jsx';
import ChooseCustomerPopup from './provisioning-customer-card.jsx';
import styles from './server-provisioning-modal.scss';

export default class ServerProvisionModal extends Component {
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
      create: cx('btn', styles['create-btn'], theme['btn-primary']),
    };

    return (
      <div className={styles.main}>
      <Modal
        headerText="Choose Customer"
        action={
          <div>
            <div className={styles['search-box']}>
              <SearchIcon className={styles['search-icon']}/>
              <input type="text"
                className={styles['search-field']}
              />
            </div>
          </div>
        }
      >
        <div className={styles.container}>
          <ChooseCustomerPopup />

          <div className={styles['btn-container']}>
            <button
              type="button"
              className={classNames.create}
            >
              Create New Customer
            </button>

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
              Save
            </button>
          </div>
        </div>
      </Modal>
      </div>
    );
  }

  _handleCloseClick = () => {
    const { onCloseClick } = this.props;
    if (onCloseClick) onCloseClick();
  };
}
