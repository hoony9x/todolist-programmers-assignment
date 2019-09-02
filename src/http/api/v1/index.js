"use strict";

const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');
const path = require('path');

const api_v1 = asyncify(express());

app.enable('trust proxy');
app.use(helmet());



module.exports = api_v1;