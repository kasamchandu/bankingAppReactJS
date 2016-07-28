import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Logo from '../logo';
import Spinner from '../spinner';
import api from '../../lib/api';
import auth from '../../lib/auth';
import { emailIsValid } from '../../lib/validate';
import styles from './login-page.scss';
const { BASE_URL } = process.env;

// TODO: Adds ability to support login page vs new registration page
export default class LoginPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    theme: PropTypes.object
  };

  static propTypes = {
    location: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      validationErrors: null,
      errors: null,
      isLoading: false
    };
  }

  render() {
    const { theme } = this.context;
    const classNames = {
      field: cx('form-control', styles.field, theme.field),
      login: cx('btn', styles['login-btn'], theme['btn-primary'])
    };
    const { validationErrors, errors, isLoading } = this.state;
    const emailFormGroupClassName = cx('form-group', {
      'has-error': (validationErrors && validationErrors.email) || errors
    });
    const passwordFormGroupClassName = cx('form-group', {
      'has-error': (validationErrors && validationErrors.password) || errors
    });

    return (<Page className="container">
      <form className={styles['login-form']} onSubmit={this._handleFormSubmit}>
        <header className={styles.header}>
          <Logo />
        </header>

        <div className={styles['form-wrapper']}>
          <div className={emailFormGroupClassName}>
            <label className={styles.label}>Email</label>
            <input ref="email"
              type="text"
              maxLength="255"
              className={classNames.field}
            />
            {validationErrors && validationErrors.email &&
              <div className={styles.error}>
                {validationErrors.email.friendlyMessage}
              </div>}
          </div>

          <div className={passwordFormGroupClassName}>
            <label className={styles.label}>Password</label>
            <input ref="password"
              type="password"
              maxLength="35"
              className={classNames.field}
            />
            {validationErrors && validationErrors.password &&
              <div className={styles.error}>
                {validationErrors.password.friendlyMessage}
              </div>}
          </div>

          {errors && errors.length > 0 && <div className={styles.error}>
            {errors.map((error, ix) => <div key={ix}>{error.friendlyMessage}</div>)}
          </div>}

          <div className={styles['login-btn-container']}>
            <button type="submit" className={classNames.login} disabled={isLoading}>
              {isLoading ? <Spinner color="#fff" width={24} height={24} /> : 'Log In'}
            </button>
          </div>
        </div>
      </form>
    </Page>);
  }

  _handleFormSubmit = (e) => {
    e.preventDefault();

    this.setState({
      isLoading: true,
      validationErrors: null,
      errors: null
    });

    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const errors = this._validate(email, password);

    if (errors) {
      // Client side validation failed
      this.setState({
        validationErrors: errors,
        isLoading: false
      });
    } else {
      this._handleLogin(email, password);
    }
  };

  _handleLogin(email, password) {
    api.login({ email, password })
      .then(res => {
        const data = res.body;

        if (data && data.access_token) {
          auth.save(data);

          this.setState({
            errors: null,
            isLoading: false
          });

          const { location } = this.props;
          const { router } = this.context;
          const redirectTo = location.state && location.state.nextPathname
                           ? location.state.nextPathname
                           : (BASE_URL || '/');

          router.replace(redirectTo);
        }
      })
      .catch(error => {
        console.log('[ERROR] login', error);
        this.setState({
          errors: [JSON.parse(error.res.text)],
          isLoading: false
        });
      })
      .finally(() => {
        if (this.state.isLoading) {
          this.setState({
            isLoading: false
          });
        }
      });
  }

  _validate(email, password) {
    let errors = {};

    if (email) {
      if (!emailIsValid(email)) {
        errors.email = {
          friendlyMessage: 'Email address must be in a valid format (e.g. name@example.com).'
        };
      }
    } else {
      errors.email = { friendlyMessage: 'Email is required.' };
    }

    if (password.length === 0) {
      errors.password = { friendlyMessage: 'Text field must not be empty.' };
    }

    return (errors.email || errors.password) ? errors : null;
  }
}
