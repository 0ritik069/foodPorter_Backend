const bcrypt = require('bcryptjs');
const validator = require('validator');
const { createUser } = require('../models/user.model');

const signup = async (req, res) => {
  console.log('Request body:', req.body);

  const { fullName, email, password, role, phone, countryCode } = req.body;

  
  if (!fullName || !email || !password || !role || !phone || !countryCode) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.',
    });
  }

  const validRoles = ['customer', 'driver', 'restaurant'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be customer, driver, or restaurant.',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  if (!validator.isMobilePhone(phone, 'any')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number.',
    });
  }

  if (!/^\+\d{1,4}$/.test(countryCode)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid country code format. Example: +91, +1, etc.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      countryCode,
    };

    createUser(userData, (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error while creating user.',
          error: err.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: {
          userId: result.insertId,
          fullName,
          email,
          role,
          phone,
          countryCode,
        },
      });
    });
  } catch (error) {
    console.error('Signup internal error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

module.exports = signup;
