import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import ErrorPage from '../components/routes/error-page';

export default class HTML extends Component {
  static propTypes = {
    lang: PropTypes.string,
    dir: PropTypes.string,
    head: PropTypes.object,
    styles: PropTypes.array,
    scripts: PropTypes.array,
    error: PropTypes.object,
    shouldShowStackTrace: PropTypes.bool
  };

  static defaultProps = {
    lang: 'en',
    dir: undefined,
    head: {
      httpEquiv: <meta key="httpEquiv" httpEquiv="X-UA-Compatible" content="IE=edge" />,
      charset: <meta key="charset" charSet="utf-8" />,
      viewport: <meta key="viewport" name="viewport"
        content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
      />
    },
    styles: [],
    scripts: []
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      lang,
      dir,
      head,
      // children,
      styles,
      scripts,
      error,
      shouldShowStackTrace
    } = this.props;
    const meta = Object.assign({}, HTML.defaultProps.head, head);

    return (
      <html lang={lang} dir={dir}>
        <head>
          {Object.keys(meta).map(k => meta[k])}
          {styles}
        </head>
        <body>
          {error
            ? (<article id="app"
                dangerouslySetInnerHTML={{
                  __html: renderToString(
                    <ErrorPage
                      error={error}
                      showStackTrace={shouldShowStackTrace}
                    />
                  )
                }} />)
            : <article id="app" />
          }

          {scripts}
        </body>
      </html>
    );
  }
}
