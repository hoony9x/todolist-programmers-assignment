"use strict";

const express = require('express');
const asyncify = require('express-asyncify');
const createError = require('http-errors');

const router = asyncify(express.Router());

/* Get all items (include finished) */
router.get('/', async (req, res, next) => {
  req.db_connection = await req.db_pool.getConnection();

  const query = "SELECT * FROM `todos`";
  const val = [];
  const [rows, fields] = await req.db_connection.execute(query, val);

  const todos = JSON.parse(JSON.stringify(rows));

  res.status(200);
  res.json(todos);
});

/* Add new item */
router.post('/', async (req, res, next) => {
  const body = req.body || {};

  const title = body['title'];
  if(Boolean(title) === false) {
    throw createError(400, "Required value 'title' is empty!");
  }

  const content = body['content'] || "";
  const priority = parseInt(body['priority']);
  if(isNaN(priority) || priority < 0 || priority > 2) {
    throw createError(400, "Required value 'priority' is must be 'low(0)', 'mid(1)', or 'high(2)'!");
  }

  const deadline = (Boolean(body['deadline']) === true) ? new Date(body['deadline']) : null;

  req.db_connection = await req.db_pool.getConnection();

  const query = "INSERT INTO `todos` SET " +
    "`title` = ?, `content` = ?, `deadline` = ?, `priority` = ?, `createdAt` = ?, `updatedAt` = ?";
  const val = [title, content, deadline, priority, new Date(), new Date()];
  const [rows, fields] = await req.db_connection.execute(query, val);

  const new_todo_id = rows.insertId;

  res.status(201);
  res.json({
    "todo_id": new_todo_id
  });
});

/* Update specific item */
router.put('/:todo_id', async (req, res, next) => {
  const todo_id = parseInt(req.params.todo_id, 10);
  if(isNaN(todo_id)) {
    throw createError(400, "Required value 'todo_id' must be positive integer!");
  }

  const body = req.body || {};

  const title = body['title'];
  if(Boolean(title) === false) {
    throw createError(400, "Required value 'title' is empty!");
  }

  const content = body['content'] || "";
  const priority = parseInt(body['priority']);
  if(isNaN(priority) || priority < 0 || priority > 2) {
    throw createError(400, "Required value 'priority' is must be 'low(0)', 'mid(1)', or 'high(2)'!");
  }

  const deadline = (Boolean(body['deadline']) === true) ? new Date(body['deadline']) : null;
  const is_finished = Boolean(body['is_finished']);

  req.db_connection = await req.db_pool.getConnection();

  const todo_exists_chk_query = "SELECT * FROM `todos` WHERE `id` = ?";
  const todo_exists_chk_val = [todo_id];
  const [chk_rows, chk_fields] = await req.db_connection.execute(todo_exists_chk_query, todo_exists_chk_val);

  if(chk_rows.length === 0) {
    throw createError(400, "Requested 'todo` does not exists!");
  }

  const update_query = "UPDATE `todos` SET " +
    "`title` = ?, `content` = ?, `deadline` = ?, `priority` = ?, `is_finished` = ?, `updatedAt` = ? " +
    "WHERE `id` = ?";
  const update_val = [title, content, deadline, priority, is_finished, new Date(), todo_id];
  const [update_rows, update_fields] = await req.db_connection.execute(update_query, update_val);

  res.status(200);
  res.json({
    "todo_id": todo_id
  });
});

/* Delete specific item */
router.delete('/:todo_id', async (req, res, next) => {
  const todo_id = parseInt(req.params.todo_id, 10);
  if(isNaN(todo_id)) {
    throw createError(400, "Required value 'todo_id' must be positive integer!");
  }

  req.db_connection = await req.db_pool.getConnection();

  const todo_exists_chk_query = "SELECT * FROM `todos` WHERE `id` = ?";
  const todo_exists_chk_val = [todo_id];
  const [chk_rows, chk_fields] = await req.db_connection.execute(todo_exists_chk_query, todo_exists_chk_val);

  if(chk_rows.length === 0) {
    throw createError(400, "Requested 'todo` does not exists!");
  }

  const delete_query = "DELETE FROM `todos` WHERE `id` = ?";
  const delete_val = [todo_id];
  const [delete_rows, delete_fields] = await req.db_connection.execute(delete_query, delete_val);

  res.status(200);
  res.json({
    "todo_id": todo_id
  });
});

module.exports = router;