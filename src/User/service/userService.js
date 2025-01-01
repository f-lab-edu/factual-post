const userRepository = require('../Repository/userRepository');

module.exports.isExist = async(username) => {
    const duplicatedUser = await userRepository.isExist(username);
    if(duplicatedUser.length){
        throw new Error('중복된 아이디가 존재합니다.');
    }
    
    return false;
};
