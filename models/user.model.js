const { pool } = require("../config/db");

// Get user by email (for login)
const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], callback);
};

// Create new user (for signup)
const createUser = (userData, callback) => {
  const { name, email, password, role } = userData;
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  pool.query(sql, [name, email, password, role], callback);
};

module.exports = {
  getUserByEmail,
  createUser 
};
