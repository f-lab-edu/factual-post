const User = require('../Entity/User');
const LoginUser = require('../Entity/LoginUser');
const UserService = require('../Service/userService');
const UserRepository = require('../Repository/userRepository');

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