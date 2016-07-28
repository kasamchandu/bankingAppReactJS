import express from 'express';
import PlatformClient from '../lib/platform-client';
import multipart from 'connect-multiparty';

const router = express.Router();
const multipartMiddleware = multipart();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Catch all top level GET endpoints
router.get('/', function(req, res) {
  const client = new PlatformClient();

  client.get('/accounts', { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.post('/:accountId', multipartMiddleware, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { accountId } = req.params;

  client.post(`/accounts/${accountId}`, options, (err, account) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/accounts/${accountId}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(account);
          }
        });
      } else {
        res.status(200).json(account);
      }
    }
  });
});

router.put('/:accountId', multipartMiddleware, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { accountId } = req.params;

  client.put(`/accounts/${accountId}`, options, (err, account) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/accounts/${accountId}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(account);
          }
        });
      } else {
        res.status(200).json(account);
      }
    }
  });
});

router.get('/:accountId', function(req, res) {
  const client = new PlatformClient();

  client.get(`/accounts/${req.params.accountId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:accountId/photo', (req, res) => {
  const client = new PlatformClient();
  client.get(`/accounts/${req.params.accountId}/photo`, {}, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.contentType('image/jpeg');
      res.end(data, 'binary');
    }
  });
});

export default router;
