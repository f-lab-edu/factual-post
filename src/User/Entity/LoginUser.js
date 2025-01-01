const User = require('./User');

class LoginUser extends User{
    constructor(username, password){
        super(username, password);
    }

    validate() {
        super.validate();
    }
}

module.exports = LoginUser;