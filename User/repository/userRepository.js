const db = require('../../databaseConnection');

exports.findAllUsers = async () => {
    const connection = await db.getConnection();
    try{
        const [users] = await connection.query('select * from users');
        return users;
    } catch(err) {
        console.error("find all users occured Err : ", err);
    } finally {
        connection.release();
    }
}