const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');
const { authenticate } = require('./middleware');

const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();

require('dotenv').config();

router.get('/accounts', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const [accounts] = await mysqlPool.execute(
      'SELECT * FROM `groups` left join accounts on groups.id = accounts.group_id where user_id =' + user.id, 
    );

    return res.json(accounts);
  } catch (error) {
    return res.status(500).end();
  }
});

router.post('/accounts', authenticate, async (req, res) => {
  const payload = req.body;
  const user = req.user;
  try {
    try {
      const [groupAvailable] = await mysqlPool.execute(
        'SELECT * FROM `groups` WHERE id =' + payload.group_id,
      );
      if (groupAvailable.length === 0) {
        console.log()
        return res.status(400).send({ error: 'No group available with such ID' });
      }
    } catch (err) {
      return res.status(500).end();
    }
    try {
      const [isAlready] = await mysqlPool.execute(
        `SELECT * FROM accounts WHERE user_id = ${user.id} and group_id = ${payload.group_id}`,
      );
      if (isAlready.length !== 0) {
        return res.status(400).send({ error: 'You are already in this group' });
      }
    } catch (err) {
      return res.status(500).end();
    }

    const [response] = await mysqlPool.execute(
      'INSERT INTO accounts (user_id, group_id) VALUES (?, ?)',
      [user.id, payload.group_id],
    );
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).end();
  }
});

module.exports = router;
