import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import userRouter from './User/router/userRouter';
import dataSource from './Database/typeormDatabase';
import { container } from './inversify.config';
import { TYPES } from './types';
import { IAuthStrategy } from './Interface/interface';
import AuthStrategy from './Interface/authInterface';

const app = express();
app.set('port', process.env.PORT || 4445);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const jwtStrategy = new AuthStrategy(container.get<IAuthStrategy>(TYPES.AuthStrategy.JWT));
app.use('/user', userRouter(jwtStrategy));

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
