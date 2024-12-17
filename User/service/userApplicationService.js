const User = require('../Entity/User');
const UserService = require('../Service/userService');
const UserRepository = require('../Repository/userRepository');

exports.signUp = async (username, password) => {
    try{
        const user = new User(username, password);
        await UserService.exist(username);
        const encodePassword = await UserService.encodePassword(password);
        user.password = encodePassword;
        await UserRepository.save(user);
    } catch(err) {
        throw new Error(err);
    }
}