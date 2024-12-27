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
app.use(cookieParser()); 

// 전체 내용을 이해 했다면, use 한곳에 담아보자. 258page

const userRouter = require('./User/Router/userRouter');
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
})