const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');

const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
const { authenticate } = require('./middleware');
require('dotenv').config();

router.get('/groups', authenticate, async (req, res) => {
  try {
    const [groups] = await mysqlPool.execute(
      'SELECT * FROM `groups`',
    );
    return res.json(groups);
  } catch (error) {
    return res.status(500).end();
  }
});

router.post('/groups', authenticate, async (req, res) => {
  const payload = req.body;
  try {
    const [response] = await mysqlPool.execute(
      'INSERT INTO `groups` (name) VALUES (?)',
      [payload.name],
    );
    res.status(200).json(response);
  } catch (err) {
    res.redirect('/');
  }
});

module.exports = router;
