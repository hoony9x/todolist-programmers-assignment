"use strict";

const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');

const http = require('http');
const path = require('path');

const http_api = require('./api');

const app = asyncify(express());

if(process.env.NODE_ENV !== 'production') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

app.enable('trust proxy');
app.use(helmet());

app.use('/api', http_api);

/* This code is serving React web application static files. */
if(process.env.NODE_ENV !== 'production') { /* NODE_ENV === "development" */
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer({ ws: true });

  app.use((req, res, next) => {
    proxy.web(req, res, { target: 'http://localhost:3000' });
  });
}
else { /* NODE_ENV === "production" */
  /* Serve static files */
  app.use(express.static(path.join(__dirname, '../', 'webapp', 'build')));

  /* Redirection rule (for single page application) */
  app.use('*', async(req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'webapp', 'build', 'index.html'));
  });
}

const server = http.createServer(app);
module.exports = server;
