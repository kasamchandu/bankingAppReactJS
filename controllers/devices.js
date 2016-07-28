import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';

const router = express.Router();
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/', jsonParser, function(req, res) {
  const client = new PlatformClient();

  client.get('/devices', { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:deviceId', jsonParser, function(req, res) {
  const client = new PlatformClient();

  client.get(`/devices/${req.params.deviceId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.post('/:deviceId/capabilities/IDENTIFY/flash', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { deviceId } = req.params;

  client.post(`/devices/${deviceId}/capabilities/IDENTIFY/flash`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.put('/:deviceId/capabilities/LIGHT', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { deviceId } = req.params;

  client.put(`/devices/${deviceId}/capabilities/LIGHT`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.put('/:deviceId/capabilities/BRIGHTNESS/level', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { deviceId } = req.params;

  client.put(`/devices/${deviceId}/capabilities/BRIGHTNESS/level`, options, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
