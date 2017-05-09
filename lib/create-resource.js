'use strict';

const debug = require('debug')('MsGraph:create-resource');
const request = require('request');
const superagent = require('superagent');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://graph.microsoft.com/v1.0/me/onenote';

const CreateResource = function() {
  debug('Create Resource');

  function dateTimeNowISO() {
    return new Date().toISOString();
  }

  /**
  * Pages API request builder & sender
  *
  * @param {string} accessToken The access token
  * @param {object} payload The body of the request
  * @param {boolean} multipart Flag to indicate if a request is multipart
  */
  function createPage(accessToken, payload, multipart) {
    debug('Create Page');

    return new Promise((resolve, reject) => {
      // Build simple request
      if (!multipart) {
        superagent
          .post(`${baseUrl}/pages`)
          .send(payload)
          .type('text/html')
          .set('Authorization', `Bearer ${accessToken}`)
          .end((err, res) => {
            if (err) return reject(err);
            return resolve(res.text);
          });

      } else {

        var r = request.post({
          url: `${baseUrl}/pages`,
          headers: {'Authorization': `Bearer ${accessToken}`}
        }, (err, httpResponse, body) => {
          if (err) return reject(err);
          resolve(body);
        });
      // Build multi-part request
        var CRLF = '\r\n';
        var form = r.form(); // FormData instance
        _.each(payload, function (partData, partId) {
          form.append(partId, partData.body, {
            // Use custom multi-part header
            header: CRLF +
              '--' + form.getBoundary() + CRLF +
              'Content-Disposition: form-data; name=\"' + partId + '\"' + CRLF +
              'Content-Type: ' + partData.contentType + CRLF + CRLF
          });
        });
      }
    });
  }

  /**
  * Create OneNote Page with Text
  *
  * @param {string} accessToken The access token
  */
  this.createPageWithSimpletext = function(accessToken) {
    debug('createPageWithSimpletext');

    var htmlPayload =
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>A page created from basic HTML-formatted text (Node.js Sample)</title>
      <meta name="created" content="${dateTimeNowISO()}">
    </head>
    <body>
      <p>This is a page that just contains some simple <i>formatted</i>
      <b>text</b></p>
    </body>
    </html>
    `;

    return createPage(accessToken, htmlPayload, false);
  };

  /**
  * Create OneNote Page with Text and Images
  *
  * @param {string} accessToken The access token
  */
  this.createPageWithTextAndImage = function(accessToken) {
    debug('createPageWithTextAndImage');
    var htmlPayload =
      `<!DOCTYPE html>
      <html>
      <head>
          <title>A page created containing an image (Node.js Sample)</title>
          <meta name=\"created\" content=\"${dateTimeNowISO()}"\">
      </head>
      <body>
          <p>This is a page that just contains some simple <i>formatted</i>
          <b>text</b> and an image</p>
          <img src=\"name:ImageData\" width=\"426\" height=\"68\" >
      </body>
      </html>
      `;

    return createPage(accessToken, {
      'Presentation': {
        body: htmlPayload,
        contentType: 'text/html'
      },
      'ImageData': {
        body: fs.readFileSync(path.normalize(`${__dirname}/../image.jpg`)),
        contentType: 'image/jpeg'
      }
    }, true);
  };

  /**
  * Create OneNote Page with a Screenshot of HTML
  *
  * @param {string} accessToken The access token
  */
  this.createPageWithScreenshotFromHtml = function(accessToken) {
    debug('createPageWithScreenshotFromHtml');
    var htmlPayload =
      `
      <!DOCTYPE html>
      <html>
      <head>
          <title>A page created with a screenshot of HTML on it (Node.js Sample)</title>
          <meta name=\"created\" content=\" ${dateTimeNowISO()} "\"/>
      </head>
      <body>
          <img data-render-src=\"name:HtmlForScreenshot\" />
      </body>
      </html>
      `;

    var htmlForScreenshot =
      `
      <html>
      <head>
         <title>Embedded HTML</title>
      </head>
      <body>
          <h1>This is a screen grab of a web page</h1>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nullam vehicula magna quis mauris accumsan, nec imperdiet nisi tempus.
          Suspendisse potenti. Duis vel nulla sit amet turpis venenatis elementum.
          Cras laoreet quis nisi et sagittis. Donec euismod at tortor ut porta.
          Duis libero urna, viverra idaliquam in, ornare sed orci.
          Pellentesque condimentum gravida felis, sed pulvinar erat suscipit sit amet. Nulla id felis quis
          sem blandit dapibus.
          Utviverra auctor nisi ac egestas.
          Quisque ac neque nec velit fringilla sagittis porttitor sit amet quam.
          </p>
      </body>
      </html>
      `;

    return createPage(accessToken, {
      'Presentation': {
        body: htmlPayload,
        contentType: 'text/html'
      },
      'HtmlForScreenshot': {
        body: htmlForScreenshot,
        contentType: 'text/html'
      }
    }, true);
  };

  /**
  * Create OneNote Page with a Screenshot of a URL
  *
  * @param {string} accessToken The access token
  */
  this.createPageWithScreenshotFromUrl = function (accessToken) {
    debug('createPageWithScreenshotFromUrl');
    var htmlPayload =
      `
      <!DOCTYPE html>
      <html>
      <head>
          <title>A page created with a URL snapshot on it (Node.js Sample)</title>
          <meta name=\"created\" content=\" ${dateTimeNowISO()} "\"/>
      </head>
      <body>
          <img data-render-src=\"http://www.onenote.com\" alt=\"An important web page\" />
          Source URL: <a href=\"http://www.onenote.com\">http://www.onenote.com</a>
      </body>
      </html>
      `;

    return createPage(accessToken, htmlPayload, false);
  };

  /**
  * Create OneNote Page with an Embedded File
  *
  * @param {string} accessToken The access token
  */
  this.createPageWithFile = function (accessToken) {
    debug('createPageWithFile');
    var htmlPayload =
      `
      <!DOCTYPE html>
      <html>
      <head>
          <title>A page with a file on it (Node.js Sample)</title>
          <meta name=\"created\" content=\" ${dateTimeNowISO()} "\"/>
      </head>
      <body>
          <object data-attachment=\"PDF File.pdf\" data=\"name:EmbeddedFile\" type=\"application/pdf\"></object>
          <img data-render-src=\"name:EmbeddedFile\" />
      </body>
      </html>
      `;

    return createPage(accessToken, {
      'Presentation': {
        body: htmlPayload,
        contentType: 'text/html'
      },
      'EmbeddedFile': {
        body: fs.readFileSync(path.normalize(`${__dirname}/../file.pdf`)),
        contentType: 'application/pdf'
      }
    }, true);
  };

};
module.exports = new CreateResource();
