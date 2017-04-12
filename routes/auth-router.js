const debug = require('debug')('MsGraph:authRouter');
const express = require('express');
const router = express.Router();

const authClient = require('../lib/auth-client');

/* GET Index page */
router.get('/', function (req, res) {
  debug('get index page');
  var authUrl = authClient.getAuthUrl();
  res.render('index', { title: 'OneNote API Node.js Sample', authUrl: authUrl});
});

router.get('/callback', function (req, res) {
  debug('get redirect callback');
  // Get the auth code from the callback url query parameters
  var authCode = req.query['code'];

  if (authCode) {
    // Request an access token from the auth code
    authClient.requestAccessTokenByAuthCode(authCode,
      function (responseData) {
        var accessToken = responseData['access_token'],
          refreshToken = responseData['refresh_token'],
          expiresIn = responseData['expires_in'];
        if (accessToken && refreshToken && expiresIn) {
          // Save the access token on a session. Using cookies in this case:
          res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000});
          res.cookie('refresh_token', refreshToken);

          res.render('callback');
        } else {
          // Handle an authentication error response
          res.render('error', {
            message: 'Invalid Azure AD Auth Response',
            error: {details: JSON.stringify(responseData, null, 2)}
          });
        }
      });
  } else {
    // Handle an error passed from the callback query params
    var authError = req.query['error'],
      authErrorDescription = req.query['error_description'];
    res.render('error', {
      message: 'Azure AD Auth Error',
      error: {status: authError, details: authErrorDescription}
    });
  }
});


module.exports = router;
