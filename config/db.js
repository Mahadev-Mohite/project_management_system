const mysql = require("mysql2/promise");

const createDbPool = () => {
  try {
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "project_management",
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
