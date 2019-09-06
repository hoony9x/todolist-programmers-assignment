"use strict";

/* Get library */
const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');
const http = require('http');
const path = require('path');

/* Get sub 'ExpressJS' app for api route */
const http_api = require('./api');

/* Create ExpressJS app with async/await error handling support */
const app = asyncify(express());

/* Display log to console for development env only */
if(process.env.NODE_ENV !== 'production') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

/* Basic security & other settings */
app.enable('trust proxy');
app.enable('x-powered-by');
app.use(helmet());

/* mount API sub application to '/api' URI
 * Other requests without '/api' will be treated as a static file serving (please check below code).
 */
app.use('/api', http_api);

/* This code is serving React web application static files. */
if(process.env.NODE_ENV !== 'production') { /* NODE_ENV === "development" */
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer({ ws: true });

  /* Redirect all requests to below url. (for local development purpose only) */
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

/* Create HTTP server and export for default module. */
const server = http.createServer(app);
module.exports = server;
