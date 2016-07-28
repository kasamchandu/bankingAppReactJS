import React, { Component, PropTypes } from 'react';
import Page from '../page';

export default class NotFoundPage extends Component {
  render() {
    return (
      <Page>
        <div style={{ marginTop: '50%' }}>
          <section className="text-center" style={{ transform: 'translate3d(0, -50%, 0)' }}>
            <h1 style={{ fontSize: 100, color: '#cecece' }}>404</h1>
            <p style={{ fontSize: 50, color: '#cecece' }}>Page not found.</p>
          </section>
        </div>
      </Page>
    );
  }
}
