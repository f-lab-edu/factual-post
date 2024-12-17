class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.validate(); // username과 Password 유효성 검사
    }

    // username과 Password 유효성 검사
    validate() {
        if (!this.username) {
            throw new Error('아이디가 입력되지 않았습니다.');
        }
        if (this.username.length < 2 || this.username.length > 20) {
            throw new Error('ID는 2자 이상, 20자 이하여야 합니다.');
        }
        if (!this.password) {
            throw new Error('비밀번호가 입력되지 않았습니다.');
        }
        if (!this.isValidPassword(this.password)) {
            throw new Error(
                '비밀번호는 8자 이상 20자 이하여야 하며, 최소 1개 이상의 특수문자를 포함해야 합니다.'
            );
        }
    }
    
    isValidPassword(password) {
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return (
            password.length >= 8 &&
            password.length <= 20 &&
            specialCharRegex.test(password)
        );
    }

}

module.exports = User;