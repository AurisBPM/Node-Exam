const express = require('express');
const mysql = require('mysql2');
const joi = require('joi');
const bcrypt = require('bcrypt');
const DB_CONFIG = require('../config/db-config');

const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();

const userSchema = joi.object({
  full_name: joi.string().required(),
  email: joi.string().email().trim().lowercase()
    .required(),
  password: joi.string().required(),
});

router.post('/register', async (req, res) => {
  let payload = req.body;
  try {
    payload = await userSchema.validateAsync(payload);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const [request] = await mysqlPool.execute('INSERT INTO users ( full_name, email, password ) VALUES (?, ?, ? )', [payload.full_name, payload.email, encryptedPassword]);
    return res.status(200).send(request);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

module.exports = router;
