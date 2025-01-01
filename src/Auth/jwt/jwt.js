const jwt = require('jsonwebtoken');

class JWTService {
    constructor(cachedMemory) {
        this.cachedMemory = cachedMemory;
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        this.accessSignature = {
            expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_MIN}m`,
            algorithm: process.env.JWT_ALGORITHM,
        };
        this.refreshSignature = {
            expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
            algorithm: process.env.JWT_ALGORITHM,
        };
    }
    
    async compareRefreshToken(refreshTokenInCookie, userId) {
        try {
            const refreshTokenInRedis = await this.cachedMemory.get(userId.toString());
            if (refreshTokenInCookie === refreshTokenInRedis) {
                return this.tokenPayload(refreshTokenInCookie);
            }
            
            return {
                message: 'invalid한 토큰입니다.',
            };
        } catch (err) {
            return {
                message: err.message,
            };
        }
    }

    sign(user) {
        return jwt.sign(this.createPayload(user), this.JWT_SECRET_KEY, this.accessSignature);
    }

    refresh() {
        return jwt.sign({}, this.JWT_SECRET_KEY, this.refreshSignature);
    }
    
    decodedAccessToken(accessToken) {
        return jwt.decode(accessToken);
    }

    getAccessTokenPayload(token) {
        return this.tokenPayload(token);
    }

    createPayload(userInformation) {
        return {
            id: userInformation.id,
            username: userInformation.username,
        };
    }

    tokenPayload(token) {
        try {
            const payload = jwt.verify(token, this.JWT_SECRET_KEY);
            
            return {
                ok: true,
                ...this.createPayload(payload),
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    }
}

module.exports = JWTService;