import * as userApplicationService from '../service/userApplicationService';
import SingletonContainer from '../../Container/SingletonContainer';
import { setAuthHeader } from '../../Auth/Util/authUtil';
import { Request, Response } from 'express';
import JWTService from '../../Auth/jwt/jwt';
import Redis from '../../Redis/redis';

const REFRESH_TOKEN_EXPIRES = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) * 24 * 60 * 60 * 1000;

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try{
        const { userId, password } = req.body;
        await userApplicationService.signUp(userId, password);
        res.status(201).send({ message: '회원가입 완료' });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
};

export const login = async (req: Request, res: Response, container: SingletonContainer): Promise<void> => {
    try{
        const jwtService = container.get<JWTService>('jwtService');
        const cachedMemory = container.get<Redis>('cacheMemory');
        const { userId, password } = req.body;
        const { accessToken, refreshToken } = await userApplicationService.login(userId, password, jwtService, cachedMemory);
        setAuthHeader(res, accessToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: REFRESH_TOKEN_EXPIRES
        });
        res.status(200).send({ message: '로그인 완료' });
    } catch(err) {
        res.status(401).send({ error: err.message });
    }
};

export const findAllUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const {page} = req.params;
        const users = await userApplicationService.findAll(page);
        res.status(200).send({
            data : users,
            message: '모든 유저를 찾았습니다.'
        });
    } catch (err) {
        res.status(404).send({
            message: `모든 유저를 찾지 못했습니다. : ${err.message}`
        });
    }
};
