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


  const saveOtp = (phone,otp,expiry,callback) => {
    const sql=`
    Insert into users (phone,otp,otp_expiry)
    values(?,?,?)
    On Duplicate Key Update otp=values(otp),
    otp_expiry=values(otp_expiry) 
    `;
    pool.query(sql,[phone, otp, expiry], callback);
  };

  const getUserByPhoneAndOtp = (phone, otp, callback) => {
    const sql = `Select * from users where phone =? And otp=?`;
    pool.query(sql, [phone,otp], callback);
  };


module.exports = {
  getUserByEmail,
  createUser,
  saveOtp,
  getUserByPhoneAndOtp

};

