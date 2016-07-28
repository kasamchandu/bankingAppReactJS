import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import cx from 'classnames';
import Paper from '../paper';
import Img from '../img';
import Spinner from '../spinner';
import { imagePath } from '../../lib/utils';
import styles from './customer-edit-form.scss';
const { COMPANY } = process.env;

export default class CustomerEditForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    webpage: PropTypes.string,
    photoUrl: PropTypes.string,
    updateDate: PropTypes.string,
    contact: PropTypes.object,
    isSaving: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object
  };

  static defaultProps = {
    name: '',
    webpage: ''
  };

  constructor(props) {
    super(props);

    const { id, name, webpage, photoUrl } = props;

    this.state = {
      id,
      name,
      webpage,
      photoUrl,
      src: photoUrl,
      isSaving: false,
      shouldDelete: false,
      files: undefined
    };
  }

  render() {
    const { theme } = this.context;
    const { isSaving, updateDate, contact } = this.props;
    const { name, webpage, src } = this.state;
    const isDirty = this._checkDirty();
    const classNames = {
      field: cx('form-control', styles.field, theme.field),
      link: cx(theme.link),
      contactEmail: cx(styles['contact-email'], theme.link),
      logoContainer: cx(styles['logo-container'], theme.box),
      btnUrl: cx(styles['btn-url'], theme.link),
      cancel: cx('btn', styles['cancel-btn']),
      save: cx('btn', styles['save-btn'], theme['btn-primary'])
    };
    const photoSrc = (src && src.indexOf('data:image') === -1 && updateDate)
                   ? `${src}?${updateDate}`
                   : src;

    return (<Paper className={styles['customer-info-card']}>
      <header className={styles.header}>
        <h4 className={styles['header-text']}>
          Customer Information
        </h4>
      </header>

      <form className={styles.form} encType="multipart/form-data" onSubmit={this._handleFormSubmit}>

        <div className={styles.container}>
          <div className={styles.column}>
            <div className={styles['form-group']}>
              <label className={styles.label}>Customer Name</label>
              <input
                ref="name"
                className={classNames.field}
                type="text"
                value={name}
                maxLength="35"
                onChange={this._handleNameChange}
              />
            </div>
            <div className={styles['form-group']}>
              <label className={styles.label}>Web Page</label>
              <input
                ref="webpage"
                className={classNames.field}
                type="text"
                value={webpage}
                maxLength="255"
                onChange={this._handleWebpageChange}
              />
            </div>
            {contact ?
            <section>
              <header>
                <h4 className={styles['contact-header']}>Primary Contact</h4>
              </header>

              <div className={styles.contact}>
                <Img
                  className={styles['contact-image']}
                  src={contact.photoUrl}
                  defaultSrc={imagePath(`/images/${COMPANY}/profile.png`)}
                />

                <div className={styles['contact-info']}>
                  <h5 className={styles['contact-name']}>{contact.firstName} {contact.lastName}</h5>
                  <a className={classNames.contactEmail} href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  <label className={styles['contact-phone']}>{contact.phone}</label>
                </div>
              </div>
            </section>
            :
            <div>
              <h4 className={styles['header-text']}>Primary Contact</h4>
              <div className={styles['form-group']}>
                <a
                  href="#"
                  className={classNames.link}
                  onClick={this._handleAddContactClick}
                >
                  <img
                    src={imagePath(`/images/${COMPANY}/profile.png`)}
                    className={styles['default-contact-avatar']}
                  />
                  <span>Add Contact</span>
                </a>
              </div>
            </div>}
          </div>
          <div className={styles.column}>
            <div className={classNames.logoContainer}>
              <Img
                className={styles.logo}
                src={photoSrc}
                defaultSrc={imagePath('/images/default-company.jpg')}
                useBackground
              />
            </div>
            <div className="pull-left">
              <a className={classNames.btnUrl} onClick={this._handleRemoveLogo}>
                Don't use logo
              </a>
            </div>
            <div className="pull-right">
              <div className={styles.upload}>
                <a className={classNames.btnUrl} onClick={this._handleUploadLogo}>
                  Upload logo
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <div className={styles['btn-container']}>
            <button
              type="button"
              className={classNames.cancel}
              onClick={this._handleCancelClick}
            >
              Cancel
            </button>
            <button type="submit" className={classNames.save} disabled={!isDirty || isSaving}>
              {isSaving ? <Spinner color="#fff" width={24} height={24} /> : 'Save'}
            </button>
          </div>
        </footer>

        <input ref="file"
          className={styles.file}
          type="file"
          name="file" accept="image/jpeg"
          onChange={this._handleFileInputChange}
        />
      </form>
    </Paper>);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isSaving && !nextProps.isSaving) {
      const { photoUrl } = nextProps;

      this.setState({
        src: photoUrl,
        defaultSrc: imagePath('/images/default-company.jpg'),
        shouldDelete: false,
        isDirty: false,
        files: undefined
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _checkDirty = () => {
    const { name: originalName, webpage: originalWebpage } = this.props;
    const { name, webpage, shouldDelete, files } = this.state;
    return (name.length !== 0) && (
            originalName !== name
            || originalWebpage !== webpage
            || files
            || shouldDelete
          );
  };

  _handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  _handleWebpageChange = (e) => {
    this.setState({ webpage: e.target.value });
  };

  // TODO: Show modal
  _handleAddContactClick = (e) => {
    e.preventDefault();
  };

  _handleRemoveLogo = (e) => {
    e.preventDefault();

    this.setState({
      src: undefined,
      shouldDelete: true,
      files: undefined,
    });
  };

  _handleUploadLogo = (e) => {
    e.preventDefault();
    this.refs.file.click();
  };

  _handleFileInputChange = () => {
    const $input = this.refs.file;

    if ($input.files && $input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.setState({
          src: e.target.result,
          shouldDelete: false,
          files: $input.files
        });
      };

      reader.readAsDataURL($input.files[0]);
    }
  };

  _handleCancelClick = (e) => {
    e.preventDefault();

    this.props.onCancel && this.props.onCancel();
  };

  _handleFormSubmit = (e) => {
    e.preventDefault();

    const { name, webpage, files, shouldDelete } = this.state;

    if (name || webpage || files || shouldDelete) {
      this.props.onSubmit && this.props.onSubmit(this.state);
    }
  };
}
