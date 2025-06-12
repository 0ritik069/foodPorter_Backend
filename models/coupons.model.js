const pool = require('../config/db');

const Coupon = {
  findByCode: async (code) => {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE code = ?', [code]);
    return rows[0];
  }
};

module.exports = Coupon;
