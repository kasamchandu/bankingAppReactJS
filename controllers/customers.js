import express from 'express';
import async from 'async';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';
import multipart from 'connect-multiparty';

const router = express.Router();
const jsonParser = bodyParser.json();
const multipartMiddleware = multipart();
// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Catch all top level GET endpoints
router.get('/', function(req, res) {
  const client = new PlatformClient();

  client.get('/customers', { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.post('/', multipartMiddleware, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });

  client.post('/customers', options, (err, customer) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/customers/${customer.id}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(customer);
          }
        });
      } else {
        res.status(200).json(customer);
      }
    }
  });
});

router.put('/:customerId', multipartMiddleware, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { customerId } = req.params;
  const shouldDelete = options.params.shouldDelete === 'true';
  delete options.params.shouldDelete;

  client.put(`/customers/${customerId}`, options, (err, customer) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/customers/${customerId}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(customer);
          }
        });
      } else if (shouldDelete) {
        client.delete(`/customers/${customerId}/photo`, {}, (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(customer);
          }
        });
      } else {
        res.status(200).json(customer);
      }
    }
  });
});

router.get('/:customerId', function(req, res) {
  const client = new PlatformClient();

  client.get(`/customers/${req.params.customerId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:customerId/photo', (req, res) => {
  const client = new PlatformClient();
  client.get(`/customers/${req.params.customerId}/photo`, {}, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.contentType('image/jpeg');
      res.end(data, 'binary');
    }
  });
});

router.get('/:customerId/locations', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const { customerId } = req.params;

  client.get(`/customers/${customerId}/locations`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get('/:customerId/sections', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const { customerId } = req.params;

  client.get(`/customers/${customerId}/locations`, { accessToken: req.headers.authorization }, (err, locations) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      const sectionCallbacks = locations.map(location => {
        return function(callback) {
          client.get(`/locations/${location.id}/sections`, { accessToken: req.headers.authorization }, (er, sections) => {
            if (er) {
              callback(er);
            } else {
              callback(null, sections);
            }
          });
        };
      });

      async.parallel(sectionCallbacks, (error, results) => {
        if (error) {
          res.status(500).send(error.text);
        } else {
          res.status(200).send([].concat.apply([], results));
        }
      });
    }
  });
});

router.get('/:customerId/contacts', jsonParser, function(req, res) {
  const client = new PlatformClient();
  const { customerId } = req.params;

  client.get(`/customers/${customerId}/contacts`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
