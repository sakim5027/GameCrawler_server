const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');
const logger = require('morgan');

require("./models");

const indexController = require("./controllers/index.js");

const app = express();

const port = 3000;

app.use(
  session({
    secret: 'the!@#Crawler058!*',
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: 'None',
      httpOnly: true,
      secure: true,
    },
  })
);

app.use(express.json());
app.use(logger('dev'));

app.use(cors({
  'origin': 'http://gamecrawler-client.s3-website.us-east-2.amazonaws.com/',
  'methods': ['OPTIONS', 'GET', 'POST' ,'PUT', 'DELETE'],
  'allowedHeaders': 'Content-Type, Accept',
  'maxAge': 10,
  'credentials': true
}));

//controller
//index
app.get("/", indexController);

let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https.createServer({
    key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
    cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8')
  },
    app
  ).listen(port);
} else {
  server = app.listen(port);
}

module.exports = server;