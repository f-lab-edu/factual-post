import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
const authorizationHeader = Symbol('Authorization');
const authorizationType = Symbol('Bearer ');

export const setAuthHeader = (res: Response, accessToken: string): void => {
    res.set(authorizationHeader.description, `${authorizationType.description}${accessToken}`);
}

export const splitAuthorizationType = (accessTokenWithType: string): string => {
    return accessTokenWithType.split(`${authorizationType.description}`)[1];
}

export const extractUserPayload = (payload: JwtPayload): {id : number, userId: string} => {
    return {id: payload.id, userId : payload.userId};
}