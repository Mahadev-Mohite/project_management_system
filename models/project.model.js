const db = require("../config/db")
exports.createProject = async (projectData) => {
    const { project_title, description } = userData;
    try {
      const [result] = await db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      );
      return result;
    } catch (err) {
      console.error("Database Error:", err);
      throw new Error("Failed to insert user into the database.");
    }
  };