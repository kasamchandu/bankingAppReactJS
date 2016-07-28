import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';

const router = express.Router();
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', jsonParser, function(req, res) {
  const client = new PlatformClient();

  client.get('/locations', { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:locationId', jsonParser, function(req, res) {
  const client = new PlatformClient();
  client.get(`/locations/${req.params.locationId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:locationId/photo', (req, res) => {
  const client = new PlatformClient();

  client.get(`/locations/${req.params.locationId}/photo`, {}, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.contentType('image/jpeg');
      res.status(200).end(data, 'binary');
    }
  });
});

router.get('/:locationId/sections', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const { locationId } = req.params;

  client.get(`/locations/${locationId}/sections`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:locationId/servers', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const { locationId } = req.params;

  client.get(`/locations/${locationId}/servers`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
