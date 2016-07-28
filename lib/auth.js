import api from './api';
const { BASE_URL } = process.env;

// TODO: Merge this with api module
export default {
  save(data, clear = true) {
    if (clear) {
      localStorage.clear();
    }

    localStorage.token = data.access_token;
    localStorage.refreshToken = data.refresh_token;
    localStorage.expiresIn = data.expires_in;
    localStorage.scope = data.scope;
    localStorage.user = JSON.stringify(data.user);
    localStorage.expireAt = Date.now() + data.expires_in * 1000 - 30 * 60 * 1000;

    this.setExpireTimeout();
  },

  setExpireTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (localStorage.token) {
      if (!localStorage.expireAt) {
        localStorage.expireAt = Date.now() + localStorage.expiresIn * 1000 - 30 * 60 * 1000;
      }

      this.timeoutId = setTimeout(() => {
        // Try refreshing token
        const user = JSON.parse(localStorage.user);

        api.refresh({
          email: user.email,
          refreshToken: localStorage.refreshToken
        }).then(response => {
          if (response && response.body && response.body.access_token) {
            const data = response.body;
            this.save(data, false);
          } else {
            alert('Your session has timed out. Please log in again.');

            this.expire();
          }
        }).catch(error => {
          alert('Your session has timed out. Please log in again.');

          this.expire();
        });
      }, localStorage.expireAt - Date.now());
    }
  },

  expire() {
    localStorage.clear();
    location.href = `${BASE_URL}/login`;
  },

  getToken() {
    return localStorage.token;
  },

  // TODO: Update to properly handle login universally.
  //       For dev, disable required login status for app routes
  loggedIn() {
    return process.env.BROWSER ? !!localStorage.token : true;
  }
};
