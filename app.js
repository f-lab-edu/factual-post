const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

app.set('port', process.env.PORT || 4445);
app.use(morgan('dev')); // combined, common, short, tiny
app.use(express.json()); // raw(), text()
app.use(express.urlencoded({extended: false})); // query string, post, put not use stream 
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie 생성은 아니다. 4.3 절을 보자.
app.use(session({
  resave: false, // 요청이 올 때 세션에 수정 사항이 생기지 않더라도, 세션을 다시 저장할지?
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지?
  secret: process.env.COOKIE_SECRET, // 4.3절의 session, cookie
  cookie: {
    httpOnly: true, // 클라이언트에서 쿠키 확인 금지
    secure: false, // https가 아닌 환경에서도 사용할 수 있다, 배포시에는 true로 해두어야 한다.
  },
  name: 'session-cookie',
}));

// 전체 내용을 이해 했다면, use 한곳에 담아보자. 258page

const userRouter = require('./User/router/userRouter');
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
})