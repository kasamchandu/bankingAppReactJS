import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { getRoutes } from './routes';
import reducers from './reducers';
import auth from './lib/auth';

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, loggerMiddleware
)(createStore);

const store = createStoreWithMiddleware(reducers);

auth.setExpireTimeout();

render(
  <Provider store={store}>
    <Router routes={getRoutes(process.env.BASE_URL)} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);
