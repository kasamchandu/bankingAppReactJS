import React, { Component, PropTypes } from 'react';
import Paper from './paper';
import styles from './modal.scss';

export default class Modal extends Component {
  static propTypes = {
    headerText: PropTypes.string.isRequired,
    headerIcon: PropTypes.element,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    action: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  };

  render() {
    const {
      headerText,
      headerIcon,
      className,
      action,
      children
    } = this.props;

    return (
      <div className={styles['modal-wrapper']}>
        <Paper className={styles['modal-content']}>
          <header className={styles['header-wrapper']}>
            <div className={styles.header}>
              <div className={styles['header-text']}>
                {headerIcon} {headerText}
              </div>
              {action && <div className={styles.action}>
                {action}
              </div>}
            </div>
          </header>

          <section className={styles.body}>
            {children}
          </section>
        </Paper>
      </div>
    );
  }
}
