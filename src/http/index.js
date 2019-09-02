"use strict";

const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');

const http = require('http');
const path = require('path');

const app = asyncify(express());

if(process.env.NODE_ENV !== 'production') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

app.enable('trust proxy');
app.use(helmet());

// TODO: Create API

if(process.env.NODE_ENV !== 'production') {
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer({ ws: true });

  app.use((req, res, next) => {
    proxy.web(req, res, { target: 'http://localhost:3000' });
  });
}
else {
  /* Serve static files */
  app.use(express.static(path.join(__dirname, '../', 'webapp', 'build')));

  /* Redirection rule (for single page application) */
  app.use('*', async(req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'webapp', 'build', 'index.html'));
  });
}

const server = http.createServer(app);
module.exports = server;
