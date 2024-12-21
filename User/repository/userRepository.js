const {getConnection, endTransaction} = require('../../databaseConnection');

module.exports.createUser = async (User) => {
    let connection;
    try{
        connection = await getConnection(true);
        const {username, password} = User;
        await connection.query("insert into User (username, password) values (?,?)", [username, password]);
        await endTransaction(connection, 'commit');
    } catch(err) {
        if(connection) await endTransaction(connection, 'rollback');
        throw new Error('회원가입에 실패했습니다.');
    }
}

module.exports.isExist = async (username) => {
    const connection = await getConnection();
    try{
        const [result] = await connection.query("select username from User where username = ?", username);
        return result;
    } catch(err) {
        throw new Error('User Repository Error');
    } finally {
        if(connection) connection.release();
    }
}