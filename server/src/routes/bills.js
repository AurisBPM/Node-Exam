const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');

const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
const { authenticate } = require('./middleware');
require('dotenv').config();

router.get('/bills/:group_id', authenticate, async (req, res) => {
  try {
    const groupId = req.params.group_id;
    const [bills] = await mysqlPool.execute(
      `SELECT * FROM bills where group_id = ${groupId}`,
    );
    return res.json(bills);
  } catch (error) {
    return res.status(500).end();
  }
});

router.post('/bills', authenticate, async (req, res) => {
  const payload = req.body;
  try {
    const [response] = await mysqlPool.execute(
      'INSERT INTO bills (amount, description, group_id) VALUES (?, ?, ?)',
      [payload.amount, payload.description, payload.group_id],
    );
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).end();
  }
});

module.exports = router;
