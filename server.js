import config from 'config';
import path from 'path';
import express from 'express';
// import graphqlHTTP from 'express-graphql';
import session from 'express-session';
import i18n from 'i18n-abide';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
// import GRAPHQL_SCHEMA from './graphql/schema';
import HTML from './views/html';
import { getRoutes } from './routes';
import controllers from './controllers';

const BASE_URL = config.get('BASE_URL');
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || config.get('PORT') || 5000;
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const ASSET_PATH = path.resolve(__dirname, '../assets');
const server = express();

// TODO: For production, use something other than default
//       MemoryStore.
server.use(session({
  secret: 'keyboard kitty',
  resave: false,
  saveUninitialized: true
}));

server.use(i18n.abide({
  supported_languages: ['en-US', 'de'],
  default_lang: 'en-US',
  debug_lang: 'it-CH',
  translation_directory: 'i18n'
}));

server.use(`${BASE_URL}/api`, controllers);
// server.use('/graphql', graphqlHTTP({ schema: GRAPHQL_SCHEMA, graphiql: true }));
server.use(BASE_URL, express.static(PUBLIC_PATH));
server.use(BASE_URL, express.static(ASSET_PATH));

if (ENV === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  server.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  server.use(hotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
}

if (BASE_URL !== '/') {
  server.get('/', (req, res) => {
    res.redirect(BASE_URL);
  });
}

server.get('*', (req, res) => {
  match({ routes: getRoutes(BASE_URL), location: req.url }, (error, redirectLocation, props) => {
    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      let status;

      if (error) {
        console.log('[Error]', error);
        status = 500;
      } else if (props) {
        status = 200;
      } else {
        status = 404;
      }

      const { lang, lang_dir } = res.locals;
      // TODO: meta tags?
      const head = {};
      // TODO: Remove colors, fonts dependencies
      const styles = [
        <link key="bootstrap" rel="stylesheet" href={`${BASE_URL}/css/bootstrap.min.css`} />,
        <link key="colors" rel="stylesheet" href={`${BASE_URL}/css/colors.css`} />,
        <link key="fonts" rel="stylesheet" href={`${BASE_URL}/css/fonts.css`} />
      ];
      if (ENV !== 'development') {
        styles.push(
          <link key="app"
            rel="stylesheet"
            href={`${BASE_URL}/css/app.css`}
          />
        );
      }

      const scripts = [
        <script
          key="main"
          type="text/javascript"
          src={`${BASE_URL}/js/app.js`}
          charSet="utf-8"
        />
      ];
      const markup = ReactDOM.renderToStaticMarkup(
        <HTML
          lang={lang}
          dir={lang_dir}
          head={head}
          styles={styles}
          scripts={scripts}
          error={error}
          shouldShowStackTrace={ENV === 'development'}
        >
          <RouterContext {...props} />
        </HTML>
      );

      res.status(status).send(`<!DOCTYPE html>${markup}`);
    }
  });
});

export default server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
