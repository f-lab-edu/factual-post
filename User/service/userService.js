const userRepository = require('../repository/userRepository');

exports.getAllUsers = async() => {
    return await userRepository.findAllUsers();
}