const mysql2 = require('mysql2/promise');

const mysqlConfig = {
  host: "localhost",
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME, 
  connectionLimit: 100,
}

const DatabasePool = mysql2.createPool(mysqlConfig);

exports.getConnection = async () => {
  try {
    return await DatabasePool.getConnection();
  } catch(err) {
    console.error("Database is not connect");
    throw err;
  }
}

//async function connectionDatabase() {
 // return new Promise((resolve, reject) => {
    //DatabasePool.getConnection((err, connection) => {
     // if(err){
      //  reject(err);
     // } else{
    //    resolve([connection, () => { connection.release(); }])
   //   }
   // })
  //})
//}

// module.exports = connectionDatabase;