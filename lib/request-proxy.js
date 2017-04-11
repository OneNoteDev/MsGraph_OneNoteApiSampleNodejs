'use strict';

const debug = require('debug')('MsGraph:request-proxy');
const pug = require('pug');

const createExamples = require('./create-examples');
const getExamples = require('./get-examples');

exports.get = function(req, res, next) {
  debug('request proxy get');

  let accessToken = req.cookies['access_token'];

  return getExamples(req.params.resource, accessToken)
  .then(response => {
    console.log(response, 'res in request proxy')
    req.graphResponse = response;
    next();
  })
  .catch(error => {
    console.log('error in request proxy', error)
    let errorResponse = pug.renderFile('views/error.pug', {
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
  let accessToken = req.cookies['access_token'];
  let proxyRequestForResource;

  switch (req.params.exampleType) {
  case 'text':
    proxyRequestForResource = 'createPageWithSimpleText';
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
    let errorResponse = pug.renderFile('views/error.pug', {
      message: 'Microsoft Graph API Error',
      error: {
        status: error.message,
        details: JSON.stringify(error, null, 3)
      }
    });
    res.send(errorResponse);
  });
};
