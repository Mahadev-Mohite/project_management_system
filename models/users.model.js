const db = require("../config/db");
// insert user
exports.createUser = async (userData) => {
  const { username, email, password } = userData;
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

// getuser by id
exports.getUserById = async (id) => {
  try {
    const [user] = await db.query(
      `SELECT username,email FROM users WHERE id = ?`,
      [id]
    );

    if (user.length === 0) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Database error:", err.message);
    throw err;
  }
};

// delete user by id
exports.deleteByid = async (id) => {
  try {
    const [user] = await db.query(`DELETE FROM users WHERE id=?`, [id]);

    if (user.length === 0) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Database error:", err.message);
    throw err;
  }
};
// update user
exports.updateUser = async (id, updateData) => {
  try {
    let fields = [];
    let values = [];

    for (let key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await db.query(query, values);
    return result.affectedRows > 0 ? result : null;
  } catch (err) {
    console.error("Error updating user:", err.message);
    throw err;
  }
};
// getByEmail
exports.getByEmail = async (email) => {
  try {
    const [user] = await db.query(`SELECT * FROM users WHERE email =?`, [
      email,
    ]);
    // console.log(user);
    return user.length > 0 ? user[0] : null;
  } catch (err) {
    console.error("Error fetching user", err.message);
    throw err;
  }
};

exports.getAllUsers = async () => {
  try {
    const [users] = await db.query(`SELECT id, username, email FROM useres`);
    return users;
  } catch (error) {
    throw new Error("Error fetching users from the database: " + error.message);
  }
};
