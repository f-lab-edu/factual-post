const User = require('../Entity/User');
const bcrypt = require('bcrypt');
const UserService = require('./userService');
const UserRepository = require('../repository/userRepository');

const SingletonContainer = require('../../Container/SingletonContainer');
const singletonContainer = new SingletonContainer();
const jwtService = singletonContainer.get('jwtService');
const redis = singletonContainer.get('redis');

module.exports.signUp = async (username, password) => {
    try{
        const user = new User(username, password);
        await UserService.isExist(username);
        await user.encodePassword(password);
        await UserRepository.createUser(user);
    } catch(err) {
        throw err;
    }
};

module.exports.login = async (username, password) => {
    new User(username, password);
    const userInformation = await userLoginVerification(username, password);
    const accessToken = jwtService.sign(userInformation);
    const refreshToken = jwtService.refresh();
    redis.set(NumberToStringUserId(userInformation.id), refreshToken);
    
    return { accessToken, refreshToken };
};

const NumberToStringUserId = (id) => {
    return id.toString();
};

const comparePasswordWithBcrypt = async (password, bcryptPassword) => {
    return await bcrypt.compare(password, bcryptPassword);
};

const userLoginVerification = async(username, userPassword) => {
    validateUsername(username);
    const userInformation = await UserRepository.loginVerification(username);

    if(userInformation.username !== username){
        throw new Error('아이디가 일치하지 않습니다.');
    }

    const passwordCheck = comparePasswordWithBcrypt(userPassword, userInformation.password);
    if(!passwordCheck){
        throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const { password, ...userWithoutPassword } = userInformation;

    return userWithoutPassword;
};

module.exports.findAllUser = async () => {
    //const offset = (page - 1) * 10;
    const users = await UserRepository.findAllUser();
    
    return users;
};

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{2,20}$/;
    if (!usernameRegex.test(username)) {
        throw new Error('허용되지 않은 문자가 입력되었습니다.');
    }
};