const authorizationHeader = Symbol('Authorization');
const authorizationType = Symbol('Bearer ');

module.exports.setAuthHeader = (res, accessToken) => {
    res.setHeader(authorizationHeader.description, `${authorizationType.description}${accessToken}`);
}

module.exports.splitAuthorizationType = (accessTokenWithType) => {
    return accessTokenWithType.split(`${authorizationType.description}`)[1];
}