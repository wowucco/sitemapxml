'use strict';

const express = require('express');
const SiteMap = require('./src/sitemap');

const endpoint = process.env.ENV_S3_ENDPOINT;
const accessKeyId = process.env.ENV_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.ENV_S3_SECRET_ACCESS_KEY;

const fs = require('fs');
const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint(endpoint);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/parse', (req, res) => {
  try {
    let {target, feedback} = req.query;

    if (!target || !feedback) {
      throw ('Missing required argument.');
    }

    res.send(SiteMap.parse(target));
  } catch (e) {
    res.send(e)
  }
});

app.get('/create', (req, res) => {
  fs.readFile('sitemap.xml', function (err, data) {
    if (err) {throw err}
    let base64data = new Buffer(data, 'binary');
    //res.send(console.log(base64data));
    s3.putObject({
      Bucket: 'sitemapxml',
      Key: 'test/sitemap.xml',
      Body: base64data
    }, response => {
      console.log(response);
      console.log(arguments);
      console.log('Successfully uploaded package.');
    });
  });
});

app.get('/get', (req, res) => {
  s3.getObject({
    Bucket: 'sitemapxml',
    Key: 'test/sitemap.xml'
  }, (err, data) => {
    if (err) console.log(err, err.stack);
    else     console.log(data);
  })
});

app.get('/listen', (req, res) => {
  res.send(s3.listBuckets({}, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      data['Buckets'].forEach(function(space) {
        console.log(space['Name']);
      })};
  }))
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);