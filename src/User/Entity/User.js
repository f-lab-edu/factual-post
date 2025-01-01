const bcrypt = require('bcrypt');

// magic number
const MINIMUM_ID_SIZE = 2;
const MAXIMUM_ID_SIZE = 20;
const MINIMUM_PW_SIZE = 8;
const MAXIMUM_PW_SIZE = 20;
const SPECIAL_CHAR_COUNT = 1;
const PASSWORD_ROUND = 10;

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.validateUsernameAndPassword();
    }

    validateUsernameAndPassword() {
        if (!this.username) {
            throw new Error('아이디가 입력되지 않았습니다.');
        }

        if (!this.userIdSizeRange(this.username)) {
            throw new Error(`ID는 ${MINIMUM_ID_SIZE}자 이상, ${MAXIMUM_ID_SIZE}자 이하여야 합니다.`);
        }

        if (!this.password) {
            throw new Error('비밀번호가 입력되지 않았습니다.');
        }

        if (!this.isValidPassword(this.password)) {
            throw new Error(
                `비밀번호는 ${MINIMUM_PW_SIZE}자 이상 ${MAXIMUM_PW_SIZE}자 이하여야 하며, 
                최소 ${SPECIAL_CHAR_COUNT}개 이상의 특수문자를 포함해야 합니다.`
            );
        }
    }
    
    async encodePassword() {
        this.password = await bcrypt.hash(this.password, PASSWORD_ROUND);
    }

    containSpecialCharacter(password) {
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        
        return specialCharRegex.test(password);
    }
    userIdSizeRange(username) {
        return username.length >= MINIMUM_ID_SIZE && username.length <= MAXIMUM_ID_SIZE;
    }
    passwordSizeRange(password) {
        return password.length >= MINIMUM_PW_SIZE && password.length <= MAXIMUM_PW_SIZE;
    }

    isValidPassword(password) {
        return (
            this.passwordSizeRange(password) &&
            this.containSpecialCharacter(password)
        );
    }

}

module.exports = User;