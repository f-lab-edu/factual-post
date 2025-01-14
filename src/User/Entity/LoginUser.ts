import User from './User';

class LoginUser extends User {
    constructor(username: string, password: string) {
        super(username, password);
    }

    validate() {
        super.validateUsernameAndPassword();
    }
}

export default LoginUser;
