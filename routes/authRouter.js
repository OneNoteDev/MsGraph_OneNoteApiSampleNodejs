var express = require('express');
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');
var createExamples = require('../lib/create-examples');

/* GET Index page */
router.get('/', function (req, res) {
    var authUrl = liveConnect.getAuthUrl();
    res.render('index', { title: 'OneNote API Node.js Sample', authUrl: authUrl});
});

router.get('/', function (req, res) {
    // Get the auth code from the callback url query parameters
    var authCode = req.query['code'];

    if (authCode) {
        // Request an access token from the auth code
        liveConnect.requestAccessTokenByAuthCode(authCode,
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
                        message: 'Invalid Live Connect Response',
                        error: {details: JSON.stringify(responseData, null, 2)}
                    });
                }
            });
    } else {
        // Handle an error passed from the callback query params
        var authError = req.query['error'],
            authErrorDescription = req.query['error_description'];
        res.render('error', {
            message: 'Live Connect Auth Error',
            error: {status: authError, details: authErrorDescription}
        });
    }

});


/* POST Create example request */
router.post('/', function (req, res) {
    var accessToken = req.cookies['access_token'];
    var exampleType = req.body['submit'];

    // Render the API response with the created links or with error output
    var createResultCallback = function (error, httpResponse, body) {
        if (error) {
            return res.render('error', {
                message: 'HTTP Error',
                error: {details: JSON.stringify(error, null, 2)}
            });
        }

        // Parse the body since it is a JSON response
        var parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (e) {
            parsedBody = {};
        }
        // Get the submitted resource url from the JSON response
        var resourceUrl = parsedBody['links'] ? parsedBody['links']['oneNoteWebUrl']['href'] : null;

        if (resourceUrl) {
            res.render('result', {
                title: 'OneNote API Result',
                body: body,
                resourceUrl: resourceUrl
            });
        } else {
            res.render('error', {
                message: 'OneNote API Error',
                error: {status: httpResponse.statusCode, details: body}
            });
        }
    };

    // Request the specified create example
    switch (exampleType) {
        case 'text':
            createExamples.createPageWithSimpleText(accessToken, createResultCallback);
            break;
        case 'textimage':
            createExamples.createPageWithTextAndImage(accessToken, createResultCallback);
            break;
        case 'html':
            createExamples.createPageWithScreenshotFromHtml(accessToken, createResultCallback);
            break;
        case 'url':
            createExamples.createPageWithScreenshotFromUrl(accessToken, createResultCallback);
            break;
        case 'file':
            createExamples.createPageWithFile(accessToken, createResultCallback);
            break;
    }
});

module.exports = router;
