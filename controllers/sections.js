import express from 'express';
import bodyParser from 'body-parser';
import PlatformClient from '../lib/platform-client';
import multipart from 'connect-multiparty';

const router = express.Router();
const jsonParser = bodyParser.json();
const multipartMiddleware = multipart();

router.get('/', function(req, res) {
  const client = new PlatformClient();

  client.get('/sections', { accessToken: req.headers.authorization }, (err, data) => {
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

  client.post('/sections', options, (err, sections) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/sections/${section.id}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(sections);
          }
        });
      } else {
        res.status(200).json(sections);
      }
    }
  });
});

router.put('/:sectionId', multipartMiddleware, function(req, res) {
  const client = new PlatformClient();
  const options = Object.assign({}, {
    accessToken: req.headers.authorization,
    params: req.body
  });
  const { sectionId } = req.params;

  client.put(`/sections/${sectionId}`, options, (err, section) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      if (req.files && req.files[0]) {
        client.upload(`/sections/${sectionId}/photo`, req.files[0], (error, response) => {
          if (error) {
            res.status(error.status).send(error.text);
          } else {
            res.status(200).json(section);
          }
        });
      } else {
        res.status(200).json(section);
      }
    }
  });
});

router.get('/:sectionId', function(req, res) {
  const client = new PlatformClient();

  client.get(`/sections/${req.params.sectionId}`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:sectionId/photo', (req, res) => {
  const client = new PlatformClient();
  client.get(`/sections/${req.params.sectionId}/photo`, {}, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.contentType('image/jpeg');
      res.end(data, 'binary');
    }
  });
});

router.get('/:sectionId/devices', function(req, res) {
  const client = new PlatformClient();

  client.get(`/sections/${req.params.sectionId}/devices`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:sectionId/recipes', function(req, res) {
  const client = new PlatformClient();

  client.get(`/sections/${req.params.sectionId}/recipes`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:sectionId/groups', function(req, res) {
  const client = new PlatformClient();

  client.get(`/sections/${req.params.sectionId}/groups`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:sectionId/scenes', function(req, res) {
  const client = new PlatformClient();

  client.get(`/sections/${req.params.sectionId}/scenes`, { accessToken: req.headers.authorization }, (err, data) => {
    if (err) {
      res.status(err.status).send(err.text);
    } else {
      res.status(200).json(data);
    }
  });
});

export default router;
