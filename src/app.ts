import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import initContainer from './Container/initContainer';
import userRouter from './User/router/userRouter';
import AuthInterface from './Interface/authInterface';
import dataSource from './Database/typeormDatabase';

const app = express();
app.set('port', process.env.PORT || 4445);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const container = initContainer();
const authMiddleware = container.get<AuthInterface>('authMiddleware');

app.use('/user', userRouter(authMiddleware, container));

dataSource.initialize()
  .then(() => {
    console.log("Initialized database with TypeORM");
    app.listen(app.get('port'), () => {
      console.log(`Server is running on port ${app.get('port')}`);
    });
  })
  .catch((err) => {
    console.error("Database connection Error:", err);
  });
