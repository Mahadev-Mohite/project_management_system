const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const createDbPool = () => {
  try {
    const pool = mysql.createPool({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    pool
      .getConnection()
      .then((connection) => {
        console.log("Database connected successfully.");
        connection.release();
      })
      .catch((error) => {
        console.error("Error connecting to the database:", error.message);
        throw error;
      });

    return pool;
  } catch (error) {
    console.error("Error setting up the database pool:", error.message);
    throw error;
  }
};

// Create and export the pool
const db = createDbPool();

module.exports = db;
