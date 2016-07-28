import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';
import accounts from './accounts';
import customers from './customers';
import locations from './locations';
import servers from './servers';
import sections from './sections';
import devices from './devices';
import timeSeries from './time-series';

const router = express.Router();
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });


router.post('/login', jsonParser, (req, res) => {
  const client = new PlatformClient();
  const { email, password } = req.body;

  client.login({ email, password }, (err, data) => {
    if (err) {
      console.log('[LOGIN]', err.text);
      res.status(err.status).send(err.text);
    } else {
      client.get('/auth', { accessToken: data.access_token }, (error, user) => {
        if (error) {
          res.status(error.status).send(error.text);
        } else {
          res.status(200).json(Object.assign({}, data, { user }));
        }
      });
    }
  });
});

router.post('/refresh', jsonParser, (req, res) => {
  const client = new PlatformClient();
  const { email, refreshToken } = req.body;

  client.refresh({ email, refreshToken }, (err, data) => {
    if (err) {
      console.log('[REFRESH]', err.text);
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.delete('/logout', (req, res) => {
  const client = new PlatformClient();

  client.logout((err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.use('/accounts', accounts);
router.use('/customers', customers);
router.use('/locations', locations);
router.use('/servers', servers);
router.use('/sections', sections);
router.use('/devices', devices);
router.use('/ts', timeSeries);

// Catch all top level GET endpoints
router.get('/:endpoint', function(req, res) {
  const client = new PlatformClient();

  client.get(`/${req.params.endpoint}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

// Catch all top level POST endpoints
router.post('/:endpoint', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });

  client.post(`/${req.params.endpoint}`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

// Catch all top level PUT endpoints
router.put('/:endpoint', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });

  client.put(`/${req.params.endpoint}`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

// Catch all top level DELETE endpoints
router.delete('/:endpoint', function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });

  client.delete(`/${req.params.endpoint}`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

export default router;
