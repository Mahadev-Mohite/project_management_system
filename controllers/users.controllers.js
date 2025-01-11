const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// create user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // console.log(req.body);
  if (!username || !email) {
    return res.status(400).json({
      error: "Username and emails are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully.",
      UserID: result.insertId,
    });
  } catch (err) {
    console.error("Error in createUser controller:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};
// get user by Id
exports.fetchUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "User ID is required!",
    });
  }
  try {
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist !",
      });
    }

    // Return the user details
    return res.status(200).json({
      message: "User fetched successfully!",
      user,
    });
  } catch (err) {
    console.error(err.message || "Error fetching user details");
    return res.status(500).json({
      message: "An error occurred while fetching user details.",
    });
  }
};

// delete
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "User ID is required!",
    });
  }
  try {
    const user = await User.deleteByid(id);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist !",
      });
    }

    // Return the user details
    return res.status(200).json({
      message: "User Deleted successfully!",
    });
  } catch (err) {
    console.error(err.message || "Error Deleting user details");
    return res.status(500).json({
      message: "An error occurred while deleting user details.",
    });
  }
};
// update user
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password } = req.body;
  console.log(req.body);

  if (!id) {
    return res.status(400).json({ message: "User Id is required" });
  }

  try {
    let result = null;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update data includes password if it's provided
      const updateData = { username, password: hashedPassword };
      result = await User.updateUser(id, updateData); // Pass the ID and update data
    } else {
      // If password is not provided, update only username
      const updateData = { username };
      result = await User.updateUser(id, updateData);
    }

    res.status(201).json({
      message: "User Updated successfully.",
    });
  } catch (err) {
    console.error("Error in Updating user ", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please Enter the email and password" });
  }
  try {
    const user = await User.getByEmail(email);
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    // match pwd
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
    // create a token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.error("Error during login", err.message);
    return res.status(500).json({ message: " An Error Occured While login " });
  }
};
