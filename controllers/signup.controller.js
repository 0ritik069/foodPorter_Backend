const bcrypt = require('bcryptjs');
const validator = require('validator');
const { createUser } = require('../models/user.model');

const signup = async (req, res) => {
  console.log('Request body:', req.body);
  const { fullName, email, password, role, phone, countryCode } = req.body;

  // 1. Required fields check
  if (!fullName || !email || !password || !role || !phone || !countryCode) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // 2. Role validation
  const validRoles = ['customer', 'driver', 'restaurant'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role.' });
  }

  // 3. Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // 4. Password validation
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  // 5. Phone number validation
  if (!validator.isMobilePhone(phone, 'any')) {
    return res.status(400).json({ success: false, message: 'Invalid phone number.' });
  }

  // 6. Country code validation (e.g., +91, +1)
  if (!/^\+\d{1,4}$/.test(countryCode)) {
    return res.status(400).json({ success: false, message: 'Invalid country code format. Use +91, +1, etc.' });
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
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      console.log('User Registered successfully');
      return res.status(201).json({ success: true, message: 'User registered successfully.' });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
      error: error.message,
    });
  }
};

module.exports = signup;
