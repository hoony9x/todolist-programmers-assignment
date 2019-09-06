"use strict";

/* Get library */
const express = require('express');
const asyncify = require('express-asyncify');
const helmet = require('helmet');
const createError = require('http-errors');
const cors = require('cors');
const mysql = require('mysql2/promise');

/* Get router object for '/api/todo' URI */
const todo_route = require('./routes/todo');

/* Create sub 'ExpressJS' application for '/api' route with async/await error handling support */
const api_app = asyncify(express());

/* Basic security & other settings */
api_app.enable('trust proxy');
api_app.enable('x-powered-by');
api_app.use(helmet());
api_app.use(cors());
api_app.use(express.json());
api_app.use(express.urlencoded({ extended: false }));

/* Create mysql connection pool (Based on Programmers runtime environment)
 * All connection will be taken from this pool.
 * */
api_app.set("mysql_pool", mysql.createPool({
  host: process.env.MYSQL_ROOT_HOST || "mysql-server",
  database: process.env.MYSQL_DATABASE || "my_database",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "password"
}));

/* If any request comes, add 'mysql_pool' object into request object. */
api_app.use(async (req, res, next) => {
  req.db_pool = api_app.get("mysql_pool"); /* Get MySQL Pool object */
  next();
});

/* This code will be executed after response.
 * To release database connection, I add event listener at here.
 * */
api_app.use(async (req, res, next) => {
  /* Failed to send response */
  res.on('close', async () => {
    try {
      /* If request object has database connection object, destroy it */
      if(req.db_connection !== undefined) {
        req.db_connection.destroy();
      }
    } catch(err) {
      /* Show log into console in development environment only */
      if(process.env.NODE_ENV !== "production") {
        console.error(err.stack);
      }
    }
  });

  /* Send response successfully */
  res.on('finish', async () => {
    try {
      /* If request object has database connection object, release it */
      if(req.db_connection !== undefined) {
        req.db_connection.release();
      }
    } catch(err) {
      /* Show log into console in development environment only */
      if(process.env.NODE_ENV !== "production") {
        console.error(err.stack);
      }
    }
  });

  next();
});

/* Mount router to '/api/todo' URI */
api_app.use('/todo', todo_route);

/* catch 404 and forward to error handler */
api_app.use(async (req, res, next) => {
  next(createError(404, "Requested URI not exists."));
});

/* error handler */
api_app.use((err, req, res, next) => {
  /* If status_code is not defined, assign 500. */
  const status_code = err.status || 500;

  /* Show log into console in development environment only */
  if(process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  /* If status_code is 50X, display error message as "Internal server error"
   * Otherwise, display error message generated from each request handling process.
   * */
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

/* Export sub 'ExpressJS' application */
module.exports = api_app;