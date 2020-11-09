const express = require('express');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());

server.use('/posts', logger, postRouter);
server.use('/users', logger, userRouter);

server.get('/', (req, res) => {
  res.status(200).json({mes: "HI, from the backend"});
});

//custom middleware

function logger(req, res, next) {
  console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
          'Origin'
      )}`
  );

  next();
}

module.exports = server;
