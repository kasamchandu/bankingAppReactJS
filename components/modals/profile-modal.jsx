import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';
import Img from '../img';
import Modal from './modal';
import Spinner from '../spinner';
import api from '../../lib/api';
import { imagePath } from '../../lib/utils';
import styles from './profile-modal.scss';
const { COMPANY } = process.env;

export default class ProfileModal extends Component {
  static propTypes = {
    user: PropTypes.object,
    onCancelClick: PropTypes.func,
    onProfileUpdate: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      firstName: user && user.firstName ? user.firstName : '',
      lastName: user && user.lastName ? user.lastName : '',
      photoUrl: user ? user.photoUrl : undefined,
      files: undefined,
      isSaving: false
    };
  }

  render() {
    const { theme } = this.context;
    const classNames = {
      profileImage: cx(styles['profile-image'], theme['profile-modal--image']),
      link: cx(styles.link, theme.link),
      field: cx('form-control', styles.field, theme.field),
      cancel: cx('btn', styles['cancel-btn']),
      save: cx('btn', styles['save-btn'], theme['btn-primary'])
    };
    const { user } = this.props;
    const { photoUrl, firstName, lastName, isSaving } = this.state;
    const isDirty = this._checkDirty();
    const userPhotoUrl = photoUrl && photoUrl.indexOf('data:image') === -1 && user.updateDate
                       ? `${photoUrl}?${user.updateDate}`
                       : photoUrl;

    return (
      <Modal>
        <form
          className={styles.form}
          encType="multipart/form-data"
          onSubmit={this._handleSubmit}
        >

          <div className={styles.container}>
            <div className="col-xs-6 col-sm-6">
              <div className={styles['image-container']} onClick={this._handleUploadClick}>
                <Img
                  className={classNames.profileImage}
                  src={userPhotoUrl}
                  defaultSrc={imagePath(`/images/${COMPANY}/profile.png`)}
                  useBackground
                />
                <div className={classNames.link}>
                  Upload Photo
                </div>
              </div>
            </div>

            <div className="col-xs-6 col-sm-6">
              <div className={styles['form-group']}>
                <h4 className={styles['header-text']}>Profile</h4>
              </div>
              <div className={styles['form-group']}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  maxLength="35"
                  className={classNames.field}
                  onChange={this._onFirstNameChange}
                />
              </div>
              <div className={styles['form-group']}>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  maxLength="35"
                  className={classNames.field}
                  onChange={this._onLastNameChange}
                />
              </div>
              <div className={styles['btn-container']}>
                <button
                  className={classNames.cancel}
                  onClick={this._handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={classNames.save}
                  disabled={!isDirty || isSaving}
                >
                  {isSaving ? <Spinner color="#fff" width={24} height={24} /> : 'Save'}
                </button>
              </div>
            </div>
          </div>

          <input ref="file"
            type="file"
            className={styles.file}
            accept="image/jpeg"
            onChange={this._onFileInputChange}
          />
        </form>
      </Modal>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleUploadClick = (e) => {
    e.preventDefault();
    this.refs.file.click();
  };

  _onFileInputChange = () => {
    const $input = this.refs.file;

    if ($input.files && $input.files[0]) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        this.setState({
          photoUrl: ev.target.result,
          files: $input.files
        });
      };

      reader.readAsDataURL($input.files[0]);
    }
  };

  _onFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value });
  };

  _onLastNameChange = (e) => {
    this.setState({ lastName: e.target.value });
  };

  _handleSubmit = (e) => {
    e.preventDefault();
    const { user, onProfileUpdate } = this.props;
    const { firstName, lastName, files } = this.state;

    this.setState({ isSaving: true });

    api.multipart(
      { method: 'PUT', endpoint: `/accounts/${user.id}`,
      data: { id: user.id, email: user.email, firstName, lastName }, files }
    ).then(res => {
      const updatedUser = {
        ...res.body,
        updateDate: Date.now()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onProfileUpdate) onProfileUpdate(updatedUser);
    }).catch(error => {
      console.log('[Error]', error);
    }).finally(() => {
      this.setState({ isSaving: false });
    });
  };

  _handleCancel = (e) => {
    e.preventDefault();

    const { onCancelClick } = this.props;

    if (onCancelClick) onCancelClick();
  };

  _checkDirty = () => {
    const { user } = this.props;
    const originalFirstName = user.firstName || '';
    const originalLastName = user.lastName || '';
    const { firstName, lastName, files } = this.state;
    const isDirty = (originalFirstName !== firstName && firstName !== '')
                  || originalLastName !== lastName
                  || files;

    return isDirty;
  };
}
