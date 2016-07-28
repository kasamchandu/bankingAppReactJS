import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';

const router = express.Router();
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/', jsonParser, function(req, res) {

  const client = new PlatformClient();
  client.get('/servers', { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:serverId', jsonParser, function(req, res) {

  const client = new PlatformClient();
  client.get(`/servers/${req.params.serverId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:serverId/devices', jsonParser, function(req, res) {

  const client = new PlatformClient();
  client.get(`/servers/${req.params.serverId}/devices`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
