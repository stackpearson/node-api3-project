const express = require('express');
const userRouter = require('./users/userRouter');
const helmet = require ('helmet');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`Method: ${req.method} | endpoint: ${req.url} | time: ${time} |`)
  next();
}

server.listen(4000, () => {
  console.log('\n* Server Running on http://localhost:4000 *\n');
});

module.exports = server;

