'use strict';

var debug = require('debug')('MsGraph:get-examples');
var request = require('superagent');

var baseUrl = 'https://graph.microsoft.com/beta/me/notes';

module.exports = function(resource, token) {
  debug();
  return new Promise((resolve, reject) => {

    if (resource.includes('-')) {
      var baseResource = resource.split('-')[0];
      var expandOn = resource.split('-')[1];
      resource = `${baseResource}?$expand=${expandOn}`;
    }
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
