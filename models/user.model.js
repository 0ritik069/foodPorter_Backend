const { pool } = require("../config/db");

// Get user by email (for login)
const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], callback);
};

// Create new user (for signup)
const createUser = (userData, callback) => {
  const { fullName, email, password, role, phone,countryCode } = userData;
  const sql = 'INSERT INTO users (fullName, email, password, role,phone,countryCode ) VALUES (?, ?, ?, ?, ?, ?)';
  pool.query(sql, [fullName, email, password, role, phone,countryCode ], callback);
};

module.exports = {
  getUserByEmail,
  createUser
};
