import { injectable, inject } from 'inversify';
import jwt, { SignOptions, Algorithm, JwtPayload } from 'jsonwebtoken';
import { extractUserPayload } from '../Util/authUtil';
import { TYPES } from '../../types';
import {ICacheMemory} from '../../Interface/interface';

@injectable()
class JWTService {
    private cachedMemory: ICacheMemory;
    private JWT_SECRET_KEY: string;
    private accessSignature: SignOptions;
    private refreshSignature: SignOptions;

    constructor(@inject(TYPES.CacheMemory) cachedMemory: ICacheMemory) {
        this.cachedMemory = cachedMemory;
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
        this.accessSignature = {
            expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_MIN}m`,
            algorithm: process.env.JWT_ALGORITHM as Algorithm,
        };
        this.refreshSignature = {
            expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
            algorithm: process.env.JWT_ALGORITHM as Algorithm,
        };
    }

    async compareRefreshToken(refreshTokenInCookie: string, userId: number): Promise<JwtPayload> {
        try {
            const refreshTokenInRedis = await this.cachedMemory.get(userId.toString());
            if (refreshTokenInCookie === refreshTokenInRedis) {
                return this.tokenPayload(refreshTokenInCookie);
            }
            
            return {
                message: 'Invalid token',
                ok: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                ok: false
            };
        }
    }

    sign(user: JwtPayload): string {
        if (!this.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined.");
        }
        return jwt.sign(extractUserPayload(user), this.JWT_SECRET_KEY, this.accessSignature);
    }

    refresh(): string {
        if (!this.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined.");
        }
        return jwt.sign({}, this.JWT_SECRET_KEY, this.refreshSignature);
    }

    decodedAccessToken(accessToken: string): JwtPayload{
        return jwt.decode(accessToken) as JwtPayload;
    }

    getAccessTokenPayload(token: string): JwtPayload {
        return this.tokenPayload(token);
    }

    private tokenPayload(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, this.JWT_SECRET_KEY!) as JwtPayload;
            return {
                ok: true,
                ...extractUserPayload(payload),
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    }
}

export default JWTService;
