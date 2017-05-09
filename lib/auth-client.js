'use strict';

const debug = require('debug')('MsGraph:auth-client');
const request = require('request');
const _ = require('underscore');

const config = require('../config');

const AuthClient = function () {
  debug('auth client');
  var oauthAuthorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    oauthTokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    clientId = config.clientId,
    clientSecret = config.clientSecret,
    redirectUrl = config.redirectUrl;

  // Helper function to create an encoded url query string from an object
  function toQueryString(obj) {
    debug('toQueryString');
    var str = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(`${key}=${obj[key]}`);
      }
    }
    return str.join('&');
  }

  /**
  * Obtain a Microsoft Graph Azure AD v2.0 authorization endpoint URL based on configuration.
  * @returns {string} The authorization endpoint URL
  */
  this.getAuthUrl = function () {
    debug('getAuthUrl');
    var scopes = ['Notes.ReadWrite.All', 'Notes.ReadWrite', 'offline_access'];
    var query = toQueryString({
      'client_id': clientId,
      'scope': scopes.join(' '),
      'redirect_uri': redirectUrl,
      'display': 'page',
      'locale': 'en',
      'response_type': 'code'
    });
    return `${oauthAuthorizeUrl}?${query}`;
  };

  /* Microsoft Graph auth request sender */
  function requestAccessToken(data, callback) {
    debug('requestAccessToken');
    request.post({url: oauthTokenUrl,
      form: _.extend({
        'client_id': clientId,
        'client_secret': clientSecret,
        'redirect_uri': redirectUrl
      }, data)},
      function (error, response, body) {
        if (error) {
          callback({});
        } else {
          callback(JSON.parse(body));
        }
      });
  }

  /**
  * @callback accessTokenCallback
  * @param {object} Response data parsed from JSON API result
  */

  /**
  * Request an access token by supplying an authorization code.
  * @param {string} authCode The authorization code
  * @param {accessTokenCallback} callback The callback with response data
  */
  this.requestAccessTokenByAuthCode = function (authCode, callback) {
    debug('requestAccessTokenByAuthCode');
    requestAccessToken({'code': authCode, 'grant_type': 'authorization_code'}, callback);
  };

  /**
  * Request an access token by supplying a refresh token.
  * @param {string} refreshToken The refresh token
  * @param {accessTokenCallback} callback The callback with response data
  */
  this.requestAccessTokenByRefreshToken = function(refreshToken, callback) {
    debug('requestAccessTokenByRefreshToken');
    requestAccessToken({'refresh_token': refreshToken, 'grant_type': 'refresh_token'}, callback);
  };

};

module.exports = new AuthClient();
