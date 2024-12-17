const bcrypt = require('bcrypt');
const userRepository = require('../Repository/userRepository');

exports.encodePassword = async(password) => {
    const round = 10;
    const encodePassword = await bcrypt.hash(password, round);
    return encodePassword;
}

exports.exist = async(username) => {
    const duplicatedUser = await userRepository.exist(username);
    if(duplicatedUser.length){
        throw new Error('중복된 아이디가 존재합니다.');
    }
    return false;
}