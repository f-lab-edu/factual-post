const mysql2 = require('mysql2/promise');

// sever core : 6
// node worker thread : 4
// node process : 6
// connectionLimit : 10 ~ 20
// mysql maximum connection : 151


const mysqlConfig = {
  host: "localhost",
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME, 
  connectionLimit: 10, 
}

const DatabasePool = mysql2.createPool(mysqlConfig);

module.exports.getConnection = async (isTransaction = false) => {
  const connection = await DatabasePool.getConnection();
  try{
    if(isTransaction){
      await connection.beginTransaction();
    }
    return connection;
  } catch(err) {
    connection.release();
    throw err;
  }
}

module.exports.endTransaction = async(connection, type) => {
  try{
    type === 'commit' ? await connection.commit() : await connection.rollback();
  } catch(err){
    throw err; 
  }finally {
    connection.release();
  }
}
