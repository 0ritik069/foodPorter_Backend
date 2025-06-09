const { pool } = require("../config/db");

// Get user by email (for login)
const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], callback);
};

// Create new user (for signup)
const createUser = (userData, callback) => {
  const { fullName, email, password, role, phone, countryCode } = userData;
  const sql = 'INSERT INTO users (fullName, email, password, role, phone, countryCode) VALUES (?, ?, ?, ?, ?, ?)';
  pool.query(sql, [fullName, email, password, role, phone, countryCode], async (err, result) => {
    if (err) return callback(err);

    // If role is restaurant, insert into restaurants table as well
    if (role === 'restaurant') {
      const restaurantSql = `
  INSERT INTO restaurants (
    name,
    address,
    phone,
    image,
    status,
    email,
    ownerName,
    rating,
    discount,
    owner_user_id
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const restaurantData = [
  userData.restaurantName || fullName,
  userData.address || 'Not Provided',
  phone,
  null,                // image
  'open',              // status default
  email,
  fullName,            // owner name
  0,                   // rating default
  0,                   // discount default
  result.insertId      // owner_user_id foreign key
];

      pool.query(restaurantSql, restaurantData, (restaurantErr) => {
        if (restaurantErr) return callback(restaurantErr);
        return callback(null, result);
      });
    } else {
      return callback(null, result);
    }
  });
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

