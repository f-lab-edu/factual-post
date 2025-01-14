import SingletonContainer from "./SingletonContainer";
import Redis from "../Redis/redis";
import JWTService from "../Auth/jwt/jwt";
import AuthJWT from "../Auth/jwt/authJWT";
import AuthInterface from "../Interface/authInterface";

const initContainer = (): SingletonContainer => {
    const singletonContainer = new SingletonContainer();
    singletonContainer.register('cacheMemory', new Redis());
    singletonContainer.register('jwtService', new JWTService(singletonContainer.get<Redis>('cacheMemory')));

    const jwtAuthMiddleware = new AuthInterface(new AuthJWT(singletonContainer.get<JWTService>('jwtService')));
    singletonContainer.register('authMiddleware', jwtAuthMiddleware);

    return singletonContainer;
}

export default initContainer;
