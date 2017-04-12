'use strict';

const debug = require('debug')('MsGraph:request-proxy');
const pug = require('pug');

const createResource = require('./create-resource');
const getResource = require('./get-resource');

/**
* Middleware for making proxy GET requests to the Microsoft Graph API
*
* @param {object} req The request from the client
* @param {object} res The response object being constructed
* @param {function} next The next function in the middleware chain
*/

exports.get = function(req, res, next) {
  debug('request proxy get');

  var accessToken = req.cookies['access_token'];

  // Make the Graph API request
  return getResource(req.params.resource, accessToken)
  .then(response => {
    req.graphResponse = response;
    next();
  })
  .catch(error => {
    // Render the error template and send to client
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

/**
* Middleware for making proxy POST requests to the Microsoft Graph API
*
* @param {object} req The request from the client
* @param {object} res The response object being constructed
* @param {function} next The next function in the middleware chain
*/

exports.post = function(req, res, next) {
  debug('request proxy post');
  var accessToken = req.cookies['access_token'];
  var proxyRequestForResource;

  // Depending on the content-type, choose the appropriate method to construct the request
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

  // Make the Graph API request based on content-type
  return createResource[proxyRequestForResource](accessToken)
  .then(response => {
    req.graphResponse = response;
    next();
  })
  .catch(error => {
    // Render the error template and send to client
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
