const express = require('express');
const cors = require('cors');
const authRoute = require('./src/routes/auth');

const server = express();
server.use(express.json());
server.use(cors());

server.use('/', authRoute);

server.listen(8080, () => {
  console.log('Server runs on 8080 port');
});
