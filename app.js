const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const SingletonContainer = require('./src/Container/SingletonContainer');

const app = express();

app.set('port', process.env.PORT || 4445);
app.use(morgan('dev')); // combined, common, short, tiny
app.use(express.json()); // raw(), text()
app.use(express.urlencoded({extended: false})); // query string, post, put not use stream 
app.use(cookieParser()); 

const singletonContainer = new SingletonContainer();
const Redis = require('./src/Redis/redis');
const JWTService = require('./src/Auth/jwt/jwt');
const AuthJWT = require('./src/Auth/jwt/authJWT');
const AuthInterface= require('./src/Interface/authInterface');
singletonContainer.register('redis', new Redis());
singletonContainer.register('jwtService', new JWTService(singletonContainer.get('redis')));

const jwtService = singletonContainer.get('jwtService');
const jwtAuthMiddleware = new AuthInterface(new AuthJWT(jwtService));


const userRouter = require('./src/User/Router/userRouter');
app.use('/user', userRouter(jwtAuthMiddleware));

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
})