"use strict";

const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');
const createError = require('http-errors');
const cors = require('cors');
const mysql = require('mysql2/promise');

const schedule_route = require('./routes/todo');

const api_app = asyncify(express());

api_app.enable('trust proxy');
api_app.use(helmet());
api_app.use(cors());
api_app.use(express.json());
api_app.use(express.urlencoded({ extended: false }));

// MySQL pool 관련 정보 지정
api_app.set("mysql_pool", mysql.createPool({
  host: process.env.MYSQL_ROOT_HOST || "mysql-server",
  database: process.env.MYSQL_DATABASE || "my_database",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "password"
}));

api_app.use(async (req, res, next) => {
  req.db_pool = api_app.get("mysql_pool"); // DB object 가져오기
  next();
});

// DB connection 을 release 하기 위해 Event Listener 등록
api_app.use(async (req, res, next) => {
  // response 를 전송하지 못했을 경우.
  res.on('close', async () => {
    try {
      if(req.db_connection !== undefined) {
        req.db_connection.destroy();
      }
    } catch(err) {
      if(process.env.NODE_ENV !== "production") {
        console.error(err.stack);
      }
    }
  });

  // response 가 정상적으로 전송된 경우.
  res.on('finish', async () => {
    try {
      if(req.db_connection !== undefined) {
        req.db_connection.release();
      }
    } catch(err) {
      if(process.env.NODE_ENV !== "production") {
        console.error(err.stack);
      }
    }
  });

  next();
});

api_app.use('/todo', schedule_route);

// catch 404 and forward to error handler
api_app.use(async (req, res, next) => {
  next(createError(404, "Requested URI not exists."));
});

// error handler
api_app.use((err, req, res, next) => {
  const status_code = err.status || 500;

  /* 콘솔에 error 표시 */
  if(process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  if(parseInt((status_code / 10).toString(), 10) === 50) {
    res.status(status_code);
    res.json({
      message: 'Internal server error'
    });
  }
  else {
    res.status(status_code);
    res.json(err);
  }
});

module.exports = api_app;