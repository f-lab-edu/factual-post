const jwt = require('jsonwebtoken');
const redisClient = require('../Redis/redis');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports.sign = (user) => {
    return jwt.sign(createPayload(user), JWT_SECRET_KEY, accessSignature)
}

module.exports.refresh = () => {
    return jwt.sign({}, JWT_SECRET_KEY, refreshSignature);
}

module.exports.decodedAccessToken = (accessToken) => {
    return jwt.decode(accessToken);
}

module.exports.getAccessTokenPayload = (token) => {
    return tokenPayload(token);
}

module.exports.refreshTokenComapre = async (represhTokenInCookie, userId) => {
    try{
        const refreshTokenInRedis = await redisClient.get(userId.toString());
        if(represhTokenInCookie === refreshTokenInRedis){
            return tokenPayload(represhTokenInCookie);
        } else{
            return { 
                message: 'invalid한 토큰입니다.'
            };
        }
    } catch(err) {
        return {
            message: err.message
        };
    }
}

const accessSignature = {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_MIN}m`,
    algorithm: process.env.JWT_ALGORITHM
}

const refreshSignature = {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    algorithm: process.env.JWT_ALGORITHM
}

// payload를 어떻게 관리할까?
const createPayload = (UserInformation) => {
    return {
        id: UserInformation.id,
        username : UserInformation.username
    }
}
// accessToken은 createPayload가 필요하고
// refreshToken은 createPayload를 해도 아무값이 없어서 상관 없고
// 분리하는게 좋을까?
const tokenPayload = (token) => {
    try{
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        return {
            ok: true,
            ...createPayload(payload)
        }
    } catch(err) {
        return {
            ok: false,
            message: err.message
        }
    }
}