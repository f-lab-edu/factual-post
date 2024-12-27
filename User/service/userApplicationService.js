const User = require('../Entity/User');
const LoginUser = require('../Entity/LoginUser');
const bcrypt = require('bcrypt');
const jwt = require('../../JWT/jwt');
const {redisClient} = require('../../Redis/redis');
const UserService = require('./userService');
const UserRepository = require('../repository/userRepository');

module.exports.signUp = async (username, password) => {
    try{
        const user = new User(username, password);
        await UserService.isExist(username);
        await user.encodePassword(password);
        await UserRepository.createUser(user);
    } catch(err) {
        throw err;
    }
}

module.exports.login = async (username, password) => {
    try{
        new LoginUser(username, password);
        const userInformation = await userLoginVerification(username, password);
        const accessToken = jwt.sign(userInformation);
        const refreshToken = jwt.refresh();
        redisClient.set(NumberToStringUserId(userInformation.id), refreshToken);
        return { accessToken, refreshToken };
    } catch(err) {
        throw err;
    }
}

const NumberToStringUserId = (id) => {
    return id.toString();
}

const comparePasswordWithBcrypt = async (password, bcryptPassword) => {
    return await bcrypt.compare(password, bcryptPassword);
}

const userLoginVerification = async(username, userPassword) => {
    const userInformation = await UserRepository.loginVerification(username);

    if(userInformation.username !== username){
        throw new Error("아이디가 일치하지 않습니다.");
    }

    const passwordCheck = comparePasswordWithBcrypt(userPassword, userInformation.password);
    if(!passwordCheck){
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const { password, ...userWithoutPassword } = userInformation;

    return userWithoutPassword;
}

module.exports.findAllUser = async () => {
    try{
        const users = await UserRepository.findAllUser();
        return users;
    } catch(err) {
        throw err;
    }
}