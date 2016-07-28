import React, { Component, PropTypes } from 'react';
import Page from '../page';

export default class ErrorPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    showStackTrace: PropTypes.bool
  };

  render() {
    const { error, showStackTrace } = this.props;

    return (
      <Page>
        <div style={{ marginTop: '50%' }}>
          <section className="text-center" style={{ transform: 'translate3d(0, -50%, 0)' }}>
            <h1 style={{ fontSize: 100, color: '#cecece' }}>500</h1>
            <p style={{ fontSize: 50, color: '#cecece' }}>Server Error</p>

            {showStackTrace &&
              <p>{error.stack}</p>
            }
          </section>
        </div>
      </Page>
    );
  }
}
