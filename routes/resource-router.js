const debug = require('debug')('MsGraph:resourceRouter');
const express = require('express');
const router = express.Router();
const pug = require('pug');

const requestProxy = require('../lib/request-proxy');

router.get('/:resource', requestProxy.get, function(req, res) {
  debug('get resource');
  var htmlResponse;
  var graphResponse = JSON.parse(req.graphResponse.text);
  if (graphResponse) {
    // Render html template
    htmlResponse = pug.renderFile('views/get-result.pug', {
      title: 'OneNote API Result',
      body: JSON.stringify(graphResponse, null, 3),
    });
  }
  else {
    htmlResponse = pug.renderFile('views/error.pug', {
      message: 'OneNote API Error',
      error: {
        status: req.graphResponse.message,
        details: JSON.stringify(graphResponse, null, 3)
      }
    });
  }
  // Send rendered template back to client
  res.send(htmlResponse);
});

/* POST Create example request */
router.post('/page/:exampleType', requestProxy.post, function(req, res) {
  debug('post page');

  var htmlResponse;
  var graphResponse = JSON.parse(req.graphResponse);

  // Get the submitted resource url from the JSON response
  var resourceUrl = graphResponse.links ? graphResponse.links.oneNoteWebUrl.href : null;

  if (resourceUrl) {
    // Render html template
    htmlResponse = pug.renderFile('views/post-result.pug', {
      title: 'OneNote API Result',
      body: JSON.stringify(graphResponse, null, 3),
      resourceUrl: resourceUrl
    });
  }
  else {
    htmlResponse = pug.renderFile('views/error.pug', {
      message: 'OneNote API Error',
      error: {
        status: req.graphResponse.message,
        details: JSON.stringify(graphResponse, null, 3)
      }
    });
  }
  // Send rendered template back to client
  res.send(htmlResponse);
});

module.exports = router;
