const db = require('../../databaseConnection');

/**
 * 
 * @param {} User
 * ...
 * 1. beginTransaction() -> commit() -> release()
 * 2. Connection에 있는 함수 사용하기 
 */
module.exports.save = async (User) => {
    let connection;
    try{
        connection = await db.getConnection();
        const {username, password} = User;
        await connection.query("insert into User (username, password) values (?,?)", [username, password]);
        await db.commitTransaction(connection);
    } catch(err) {
        if(connection) await db.rollbackTransaction(connection);
        throw new Error('회원가입에 실패했습니다.');
    }
}

module.exports.exist = async (username) => {
    const connection = await db.getConnection();
    try{
        const [result] = await connection.query("select username from User where username = ?", username);
        return result;
    } catch(err) {
        throw new Error('User Repository Error');
    } finally {
        if(connection) connection.release();
    }
}