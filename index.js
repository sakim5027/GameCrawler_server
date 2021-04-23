const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

require("./models");

const indexController = require("./controllers/index.js");
const userController = require("./controllers/user.js");
const reviewController = require("./controllers/review.js");
const interestController = require("./controllers/interest.js");

const app = express();

const port = 5000;

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

//user
app.post("/user/login", userController.login); //로그인
app.post("/user/logout", userController.logout); //로그아웃
app.post("/user/check-login-id", userController.checkLoginId); //아이디중복체크
app.post("/user/signup", userController.signup); //회원가입
app.post("/user/find-id", userController.findId); //아이디찾기
app.post("/user/find-password", userController.findPassword); //비밀번호찾기
app.get("/user/info", userController.info); //회원정보조회
app.put("/user/edit", userController.edit); //회원정보수정

//review
app.get("/reviews", reviewController.list); //리뷰목록정보조회
app.post("/review", reviewController.regist); //리뷰등록
app.get("/review", reviewController.info); //리뷰정보조회
app.put("/review", reviewController.modify); //리뷰수정
app.delete("/review/:review_id", reviewController.delete); //리뷰삭제

//interest
app.post("/interest", interestController.regist); //관심등록
app.delete("/interest/:interest_id", interestController.delete); //리뷰삭제

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