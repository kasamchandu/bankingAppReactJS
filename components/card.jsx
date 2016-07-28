import React, { Component, PropTypes } from 'react';
import Paper from './paper';
import styles from './card.scss';

export default class Card extends Component {
  static propTypes = {
    headerText: PropTypes.string.isRequired,
    headerSubtext: PropTypes.string,
    headerIcon: PropTypes.element,
    action: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onHeaderClick: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const {
      headerText,
      headerSubtext,
      headerIcon,
      action,
      className,
      style,
      children
    } = this.props;

    return <Paper className={className} style={style}>
      <header className={styles['header-wrapper']} onClick={this._handleHeaderClick}>
        <div className={styles.header}>
          <div className={styles['header-text']}>
            {headerIcon} {headerText}
            <span className={styles['header-subtext']}>
              {headerSubtext || ''}
            </span>
          </div>
          {action && <div className={styles.action}>
            {action}
          </div>}
        </div>
      </header>

      <section className={styles.body} onClick={this._handleClick}>
        {children}
      </section>
    </Paper>;
  }

  _handleClick = () => {
    this.props.onClick && this.props.onClick();
  };

  _handleHeaderClick = () => {
    this.props.onHeaderClick && this.props.onHeaderClick();
  };
}
