const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');
const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
const { authenticate } = require("./middleware");
require("dotenv").config();

router.get("/accounts", authenticate, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
      const [accounts] = await mysqlPool.execute(
        "SELECT * FROM `groups` left join accounts on groups.id = accounts.group_id where user_id =" + user.id, 
      );
      console.log(accounts);
      return res.json(accounts);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  router.post("/accounts", authenticate,  async (req, res) => {
    const payload = req.body;
    const user = req.user;

    console.log("user");
    console.log(payload);
    console.log(user);
    try {

       try {

        const [isAlready] = await mysqlPool.execute(
            `SELECT * FROM accounts WHERE user_id = ${user.id} and group_id = ${payload.group_id}`
          );
        if (isAlready.length != 0){
            return res.status(400).send({ error: "You are already in this group" });
        }

       } catch (err) {
return res.status(500).end();      
       }


      const [response] = await mysqlPool.execute(
        "INSERT INTO accounts (user_id, group_id) VALUES (?, ?)",
        [user.id, payload.group_id],
      );
      res.status(200).json(response);
    } catch (err) {
      return  res.status(500).end();
    }
  });

module.exports = router;