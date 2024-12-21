const User = require('../Entity/User');

class LoginUser extends User{
    constructor(username, password){
        super(username, password);
        this.validate();
    }

    validate() {
        // id, password가 둘다 잘 들어와야 한다.
        if(!this.username){
            throw new Error("아이디를 입력해주세요.");
        }

        if(!this.password){
            throw new Error("패스워드를 입력해주세요.");
        }
    }
}

module.exports = LoginUser;