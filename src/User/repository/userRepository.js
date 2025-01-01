const { getConnection, endTransaction } = require('../../../databaseConnection');

module.exports.createUser = async (User) => {
    let connection;
    try{
        connection = await getConnection(true);
        const { username, password } = User;
        await connection.query('insert into User (username, password) values (?,?)', [ username, password ]);
        await endTransaction(connection, 'commit');
    } catch(err) {
        if(connection) await endTransaction(connection, 'rollback');
        throw new Error(`회원가입에 실패했습니다. : ${err.message}`);
    }
};

module.exports.isExist = async (username) => {
    const connection = await getConnection();
    try{
        const [ result ] = await connection.query('select username from User where username = ?', username);
        
        return result;
    } catch(err) {
        throw new Error(`User Repository ${err.message}`);
    } finally {
        if(connection) connection.release();
    }
};

module.exports.loginVerification = async (username) => {
    const connection = await getConnection();
    try{
        const [ result ] = await connection.query('select * from User where username = ?', username);
        
        return result[0];
    } catch(err) {
        throw new Error(`User Repository Check ${err.message}`);
    } finally {
        if(connection) connection.release();
    }
};

module.exports.findAllUser = async () => {
    const connection = await getConnection();
    try{
        const offset = 1;
        const limit = 10;
        const [ user ] = await connection.query('select * from User limit ? offset ?', [ limit, offset ]);
        
        return user;
    } catch(err) {
        throw new Error(`Find All User Repository Error : ${err.message}`);
    } finally {
        if(connection) connection.release();
    }
};