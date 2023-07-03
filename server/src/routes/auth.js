const express = require('express');
const mysql = require('mysql2');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DB_CONFIG = require('../config/db-config');

const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
require('dotenv').config();

const userSchema = joi.object({
  full_name: joi.string().required(),
  email: joi.string().email().trim().lowercase()
    .required(),
  password: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().trim().lowercase()
    .required(),
  password: joi.string().required(),
});

router.post('/register', async (req, res) => {
  let payload = req.body;
  try {
    payload = await userSchema.validateAsync(payload);
  } catch (err) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const [response] = await mysqlPool.execute('INSERT INTO users ( full_name, email, password ) VALUES (?, ?, ? )', [payload.full_name, payload.email, encryptedPassword]);
    const token = jwt.sign(
      {
        email: payload.email,
        id: response.insertId,
        full_name: payload.full_name,
      },
      process.env.JWT_SECRET,
    );
    return res.status(201).json({ token });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Duplicate entry' });
    }
    return res.status(500).end();
  }
});

router.post('/login', async (req, res) => {
  let payload = req.body;

  try {
    payload = await loginSchema.validateAsync(payload);
  } catch (error) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const [data] = await mysqlPool.execute(
      `
        SELECT * FROM users
        WHERE email = ?
    `,
      [payload.email],
    );

    if (!data.length) {
      return res.status(400).send({ error: 'Email or password did not match' });
    }

    const isPasswordMatching = await bcrypt.compare(
      payload.password,
      data[0].password,
    );

    if (isPasswordMatching) {
      const token = jwt.sign(
        {
          email: data[0].email,
          id: data[0].id,
        },
        process.env.JWT_SECRET,
      );
      return res.status(200).send({ token });
    }

    return res.status(400).send({ error: 'Email or password did not match' });
  } catch (error) {
    return res.status(500).end();
  }
});

module.exports = router;
