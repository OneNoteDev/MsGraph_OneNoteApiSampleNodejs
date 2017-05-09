'use strict';

const debug = require('debug')('MsGraph:get-resource');
const request = require('superagent');

const baseUrl = 'https://graph.microsoft.com/v1.0/me/onenote';

/**
* Get OneNote resource
*
* @param {string} resource The OneNote resource to request
* @param {string} token The access token
*/

module.exports = function getResource(resource, token) {
  debug();
  return new Promise((resolve, reject) => {

    // If there is an expand query string parameter to be included, find the base resource and the resource to expand
    if (resource.includes('-')) {
      var baseResource = resource.split('-')[0];
      var expandOn = resource.split('-')[1];
      resource = `${baseResource}?$expand=${expandOn}`;
    }

    // Request the resource from the Graph API
    request
      .get(`${baseUrl}/${resource}`)
      .type('text/html')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
  });
};
