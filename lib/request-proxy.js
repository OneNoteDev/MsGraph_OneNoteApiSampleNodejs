'use strict';

var debug = require('debug')('MsGraph:request-proxy');
var pug = require('pug');

var createExamples = require('./create-examples');
var getExamples = require('./get-examples');

exports.get = function(req, res, next) {
  debug('request proxy get');

  var accessToken = req.cookies['access_token'];

  return getExamples(req.params.resource, accessToken)
  .then(response => {
    req.graphResponse = response;
    next();
  })
  .catch(error => {
    var errorResponse = pug.renderFile('views/error.pug', {
      message: 'Microsoft Graph API Error',
      error: {
        status: error.message,
        details: JSON.stringify(error, null, 3)
      }
    });
    res.send(errorResponse);
  });
};

exports.post = function(req, res, next) {
  debug('request proxy post');
  var accessToken = req.cookies['access_token'];
  var proxyRequestForResource;

  switch (req.params.exampleType) {
  case 'text':
    proxyRequestForResource = 'createPageWithSimpletext';
    break;
  case 'textimage':
    proxyRequestForResource = 'createPageWithTextAndImage';
    break;
  case 'html':
    proxyRequestForResource = 'createPageWithScreenshotFromHtml';
    break;
  case 'url':
    proxyRequestForResource = 'createPageWithScreenshotFromUrl';
    break;
  case 'file':
    proxyRequestForResource = 'createPageWithFile';
    break;
  }

  return createExamples[proxyRequestForResource](accessToken)
  .then(response => {
    req.graphResponse = response;
    next();
  })
  .catch(error => {
    var errorResponse = pug.renderFile('views/error.pug', {
      message: 'Microsoft Graph API Error',
      error: {
        status: error.message,
        details: JSON.stringify(error, null, 3)
      }
    });
    res.send(errorResponse);
  });
};
