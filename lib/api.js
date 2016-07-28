import request from 'superagent-bluebird-promise';
import { createHash } from 'crypto';
import auth from './auth';
const { BASE_URL } = process.env;
const API_URL = `${BASE_URL}/api`;

/**
 * API client for browser
 */
export default {
  login({ email, password }) {
    const req = request
      .post(`${API_URL}/login`)
      .send({
        email,
        password: createHash('sha256').update(password).digest('hex')
      });

    return req.promise();
  },

  refresh({ email, refreshToken }) {
    const req = request
      .post(`${API_URL}/refresh`)
      .send({
        email,
        refreshToken
      });

    return req.promise();
  },

  logout() {
    return this.delete('/auth');
  },

  multipart({ method, endpoint, data, files = {} }) {
    const formData = new FormData();

    for (const key in files) {
      if (files.hasOwnProperty(key) && files[key] instanceof File) {
        formData.append(key, files[key]);
      }
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    const req = request(method, `${API_URL}${endpoint}`)
      .set('Authorization', `${auth.getToken()}`)
      .send(formData);

    return req.promise();
  },

  request({ method, endpoint, data }) {
    const req = request(method, endpoint)
      .set('Content-Type', 'application/json')
      .set('Authorization', `${auth.getToken()}`)
      .send(data);

    return req.promise().catch(error => {
      // Session has timed out
      if (error.status === 401) {
        alert('Your session has timed out. Please log in again.');
        auth.expire();
      }
    });
  },

  get(endpoint, data) {
    return this.request({
      method: 'GET',
      endpoint: `${API_URL}${endpoint}`,
      data
    });
  },

  post(endpoint, data) {
    return this.request({
      method: 'POST',
      endpoint: `${API_URL}${endpoint}`,
      data
    });
  },

  put(endpoint, data) {
    return this.request({
      method: 'PUT',
      endpoint: `${API_URL}${endpoint}`,
      data
    });
  },

  delete(endpoint, data) {
    return this.request({
      method: 'DELETE',
      endpoint: `${API_URL}${endpoint}`,
      data
    });
  }
};
