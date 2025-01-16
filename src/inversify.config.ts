import { Container } from "inversify";
import { TYPES } from './types';
import Redis from './Redis/redis';
import JWT from './Auth/jwt/authJWT'
import JWTService from './Auth/jwt/jwt';
import {ICacheMemory, IAuthStrategy} from './Interface/interface';

const container = new Container();
container.bind<ICacheMemory>(TYPES.CacheMemory).to(Redis).inSingletonScope();
container.bind<JWTService>(TYPES.JWTService).to(JWTService).inSingletonScope();
container.bind<IAuthStrategy>(TYPES.AuthStrategy.JWT).to(JWT).inSingletonScope();

export {container};