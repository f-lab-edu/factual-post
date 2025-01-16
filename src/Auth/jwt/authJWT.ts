import {Request, Response} from 'express';
import { setAuthHeader, splitAuthorizationType, extractUserPayload } from '../Util/authUtil';
import { JwtPayload } from 'jsonwebtoken';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import {IAuthStrategy} from '../../Interface/interface';
import JWTService from './jwt';

class VerifyToken {
    private jwtService: JWTService;

    constructor(@inject(TYPES.JWTService) jwtService: JWTService) {
        this.jwtService = jwtService;
    }

    verifyAccessToken(accessToken: string): JwtPayload {
        const payload = this.jwtService.getAccessTokenPayload(accessToken);
        if (!payload.ok) {
            throw new Error(payload.message || 'Invalid access token');
        }
        return extractUserPayload(payload);
    }

    async verifyRefreshToken(refreshToken: string, userId: number): Promise<JwtPayload> {
        return await this.jwtService.compareRefreshToken(refreshToken, userId);
    }

    decodedAccessToken(accessToken: string): JwtPayload {
        return this.jwtService.decodedAccessToken(accessToken);
    }

    sign(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }
}

@injectable()
class JWT extends VerifyToken implements IAuthStrategy{
    private JWT_EXPIRED = Symbol('jwt expired');

    async authenticate(req: Request, res: Response): Promise<boolean> {
        const accessToken = this.extractAccessToken(req.headers.authorization);
        try {
            if (accessToken === null) {
                throw new Error('Access token is missing.');
            }
            const payload = this.verifyAccessToken(accessToken);
            this.attachUserToRequest(req, payload);
            return true;
        } catch (err) {
            if (err.message === this.JWT_EXPIRED.description) {
                return await this.refreshTokenVerification(req, res, accessToken);
            } else {
                throw err;
            }
        }
    }

    async refreshTokenVerification(req : Request, res : Response , accessToken : string) {
        const payload = this.decodedAccessToken(accessToken);
        const refreshToken = req.cookies.refreshToken;
        const refreshTokenCompareResult = await this.verifyRefreshToken(refreshToken, payload.id);

        if (!refreshTokenCompareResult.ok) {
            throw new Error(refreshTokenCompareResult.message);
        }

        const newAccessToken = this.sign(payload);
        setAuthHeader(res, newAccessToken);
        this.attachUserToRequest(req, payload);
        
        return true;
    }

    private extractAccessToken(authorization: string | undefined): string | null {
        if (!authorization) return null;

        return splitAuthorizationType(authorization);
    }

    private attachUserToRequest(req: Request, payload: JwtPayload): void {
        req.user = payload;
    }
}

export default JWT;
