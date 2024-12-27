const { sign, decodedAccessToken, getAccessTokenPayload, refreshTokenComapre } = require('../JWT/jwt');

module.exports.authJWT = async (req, res, next) => {
	try{
		const accessToken = isExistAccessToken(req.headers.authorization);
		if(accessToken === null){
			return unauthorizedResponse(res, 'AccessToken이 존재하지 않습니다.');
		}
		
		const accessTokenPayload = getAccessTokenPayload(accessToken);
		if(accessTokenPayload.ok) {
			attachUserToRequest(req, accessTokenPayload);
			return next();
		}
		
		if(accessTokenPayload.message === 'jwt expired'){
			return refreshTokenVerification(req, res, next, accessToken);
		}

		return unauthorizedResponse(res, 'invalid Access Token 입니다.');		
	} catch(err) {
		return unauthorizedResponse(res, '권한이 존재하지 않습니다.');
	}

}

const refreshTokenVerification = async (req, res, next, accessToken) => {
    try {
        const accessTokenPayload = decodedAccessToken(accessToken);
		const represhTokenInCookie = req.cookies.refreshToken;
        const refreshTokenCompareResult = await refreshTokenComapre(represhTokenInCookie, accessTokenPayload.id);
		
		if (refreshTokenCompareResult.ok) { // payload에 담기는 내용이 변경될수도 있잔항? 그것도 생각해서 코드를 작성핮.
			const newAccessToken = sign(accessTokenPayload);
            attachUserToRequest(req, accessTokenPayload);
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
            return next();
        } else {
            return unauthorizedResponse(res, refreshTokenCompareResult.message); 
        }

    } catch (err) {
        return unauthorizedResponse(res, 'Refresh Token 처리 중 오류가 발생했습니다.');
    }
}

const splitBearerAccessToken = (accessToken) => {
	return accessToken.split('Bearer ')[1];
}

const isExistAccessToken = (accessToken) => {
	if(!accessToken) {
		return null;
	} else{
		return splitBearerAccessToken(accessToken);
	}
}

const unauthorizedResponse = (res, message) => {
	return res.status(401).send({message: message});
}

const attachUserToRequest = (req, accessTokenPayload) => {
	req.id = accessTokenPayload.id;
	req.username = accessTokenPayload.username;
}