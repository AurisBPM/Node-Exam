const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');
const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
const { authenticate } = require("./middleware");
require("dotenv").config();

router.get("/accounts", authenticate, async (req, res) => {
    try {
      const [accounts] = await mysqlPool.execute(
        "SELECT * FROM accounts",
      );
      console.log(accounts);
      return res.json(accounts);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  router.post("/accounts", async (req, res) => {
    const payload = req.body;
    console.log(payload);
    try {
      const [response] = await mysqlPool.execute(
        "INSERT INTO accounts (user_id, group_id) VALUES (?, ?)",
        [payload.user_id, payload.group_id],
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;