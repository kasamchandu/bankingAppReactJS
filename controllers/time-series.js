import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/customers/:customerId', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const i = req.url.indexOf('?');
  let querystring = '';
  if (i > -1) {
    querystring = req.url.substring(i + 1);
  }

  client.get(`/customers/${req.params.customerId}/tsdata?${querystring}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/customers/:customerId/summary', jsonParser, function(req, res) {
  const client = new PlatformClient();

  client.get(`/customers/${req.params.customerId}/tsdata/summary`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/locations/:locationId', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const i = req.url.indexOf('?');
  let querystring = '';
  if (i > -1) {
    querystring = req.url.substring(i + 1);
  }

  client.get(`/locations/${req.params.locationId}/tsdata?${querystring}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/sections/:sectionId', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const i = req.url.indexOf('?');
  let querystring = '';
  if (i > -1) {
    querystring = req.url.substring(i + 1);
  }

  client.get(`/sections/${req.params.sectionId}/tsdata?${querystring}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/locations/:locationId/summary', jsonParser, function(req, res) {
  const client = new PlatformClient();

  client.get(`/locations/${req.params.locationId}/tsdata/summary`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
