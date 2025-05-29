const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/user.model');
require('dotenv').config();

const login = (role) => async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  getUserByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database Error' });
    }
    if (!results || results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    console.log('Login Successfully');
    return res.status(200).json({
      success: true,
      message: `${role} Login successfully`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

module.exports = {
  loginCustomer: login('customer'),
  loginDriver: login('driver'),
  loginRestaurant: login('restaurant'),
  loginAdmin: login('admin')
};
