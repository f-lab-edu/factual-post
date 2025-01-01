class VerifyToken {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }

    verifyAccessToken(accessToken) {
        const payload = this.jwtService.getAccessTokenPayload(accessToken);
        if (!payload.ok) {
            throw new Error(payload.message);
        }
        
        return payload;
    }

    verifyRefreshToken(refreshToken, userId) {
        return this.jwtService.compareRefreshToken(refreshToken, userId);
    }

    decodedAccessToken(accessToken) {
        return this.jwtService.decodedAccessToken(accessToken);
    }

    sign(payload) {
        return this.jwtService.sign(payload);
    }
}

class AuthJWT extends VerifyToken {
    constructor(jwtService) {
        super(jwtService);
        this.JWT_EXPIRED = Symbol('jwt expired');
    }

    async authenticate(req, res) {
        const accessToken = this.extractAccessToken(req.headers.authorization);
        try {
            if (!accessToken) {
                throw new Error('Access token이 존재하지 않습니다.');
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

    async refreshTokenVerification(req, res, accessToken) {
        const payload = this.decodedAccessToken(accessToken);
        const refreshToken = req.cookies.refreshToken;
        const refreshTokenCompareResult = await this.verifyRefreshToken(refreshToken, payload.id);

        if (!refreshTokenCompareResult.ok) {
            throw new Error(refreshTokenCompareResult.message);
        }

        const newAccessToken = this.sign(payload);
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        this.attachUserToRequest(req, payload);
        
        return true;
    }

    attachUserToRequest(req, accessTokenPayload) {
        req.user = {
            id: accessTokenPayload.id,
            username: accessTokenPayload.username
        };
    }

    extractAccessToken(authorizationHeader) {
        if (!authorizationHeader) {
            return null;
        }
        
        return authorizationHeader.split('Bearer ')[1];
    }
}

module.exports = AuthJWT;
