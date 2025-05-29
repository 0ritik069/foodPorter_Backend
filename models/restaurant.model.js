const pool = require('../config/db');

const Restaurant = {
  create: async ({ name, address, phone, image, status, email, ownerName }) => {
    const [result] = await pool.query(
      'INSERT INTO restaurants (name, address, phone, image, status, email, ownerName) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, phone, image, status, email, ownerName]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM restaurants WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, { name, address, phone, image, status, email, ownerName }) => {
    await pool.query(
      'UPDATE restaurants SET name = ?, address = ?, phone = ?, image = ?, status = ?, email = ?, ownerName = ? WHERE id = ?',
      [name, address, phone, image, status, email, ownerName, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM restaurants WHERE id = ?', [id]);
  },
};

module.exports = Restaurant;
