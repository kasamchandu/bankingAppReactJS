import config from 'config';
import request from 'superagent';
import fs from 'fs';

const VERSION = config.get('VERSION');
const API_HOST = config.get('API_HOST');
const API_BASE_URL = config.get('API_BASE_URL');
const CLIENT_ID = config.get('CLIENT_ID');
const CLIENT_SECRET = config.get('CLIENT_SECRET');
const PLATFORM_URL = `${API_HOST}${API_BASE_URL}/api`;

/**
 * Platform client
 */
export default class PlatformClient {
  login({ email, password }, callback) {
    const endpoint = `${API_HOST}${API_BASE_URL}/oauth/token`;

    request
      .post(endpoint)
      .type('form')
      .send({
        username: email,
        password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'password'
      })
      .end((err, res) => {
        console.log('[LOGIN]', endpoint);
        let error = err;
        if (error) {
          error = err.response;
          console.log('[PLATFORM] ERROR', error ? error.error : error);
        }
        callback(error, res ? res.body : null);
      });
  }

  refresh({ email, refreshToken }, callback) {
    const endpoint = `${API_HOST}${API_BASE_URL}/oauth/token`;

    request
      .post(endpoint)
      .type('form')
      .send({
        username: email,
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token'
      })
      .end((err, res) => {
        console.log('[REFRESH]', endpoint);
        let error = err;
        if (error) {
          error = err.response;
          console.log('[PLATFORM] ERROR', error ? error.error : error);
        }
        callback(error, res ? res.body : null);
      });
  }

  logout(data, callback) {
    this.delete('/auth', data, callback);
  }

  upload(endpoint, file, callback) {
    fs.readFile(file.path, (err, data) => {
      request.post(`${PLATFORM_URL}${endpoint}`)
        .set('Content-Type', 'image/jpeg')
        .send(data)
        .end(callback);
    });
  }

  request({ method, endpoint, data }, callback) {
    request(method, `${PLATFORM_URL}${endpoint}`)
      .set('User-Agent', `Management/${VERSION}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${data.accessToken}`)
      .set('client_id', CLIENT_ID)
      .send(data.params)
      .end(function onRequestEnd(err, res) {
        console.log(method, `${PLATFORM_URL}${endpoint}`, data.params);
        let error = err;
        if (error) {
          error = err.response;
          console.log('[PLATFORM] ERROR', error ? error.error : error);
        }
        callback(error, res ? res.body : null);
      });
  }

  get(endpoint, data, callback) {
    this.request({
      method: 'GET',
      endpoint,
      data
    }, callback);
  }

  post(endpoint, data, callback) {
    this.request({
      method: 'POST',
      endpoint,
      data
    }, callback);
  }

  put(endpoint, data, callback) {
    this.request({
      method: 'PUT',
      endpoint,
      data
    }, callback);
  }

  delete(endpoint, data, callback) {
    this.request({
      method: 'DELETE',
      endpoint,
      data
    }, callback);
  }
}
