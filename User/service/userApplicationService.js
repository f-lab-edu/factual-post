const User = require('../Entity/User');
const LoginUser = require('../Entity/LoginUser');
const UserService = require('../Service/userService');
const UserRepository = require('../Repository/userRepository');

module.exports.signUp = async (username, password) => {
    try{
        const user = new User(username, password);
        await UserService.isExist(username);
        const encodePassword = await UserService.encodePassword(password);
        user.password = encodePassword;
        await UserRepository.save(user);
    } catch(err) {
        throw err;
    }
}