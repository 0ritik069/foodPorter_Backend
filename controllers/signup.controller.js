const bcrypt = require('bcryptjs');
const { createUser } = require('../models/user.model');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const validRoles = ['customer', 'driver', 'restaurant'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashedPassword, role };

    createUser(userData, (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      console.log('User Registered successfully');
      return res.status(201).json({ success: true, message: 'User registered successfully.' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error.', error: error.message });
  }
};

module.exports = signup;
