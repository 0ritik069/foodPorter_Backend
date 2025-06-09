const pool = require('../config/db');

const Category = {
  create: async ({ name, restaurant_id, image, distance }) => {
    const [result] = await pool.query(
      'INSERT INTO categories (name, restaurant_id, image, distance) VALUES (?, ?, ?, ?)',
      [name, restaurant_id, image, distance]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  },

  findByRestaurantId: async (restaurant_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = ?',
      [restaurant_id]
    );
    return rows;
  },

  findByCategoryId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, { name, distance, image }) => {
    await pool.query(
      'UPDATE categories SET name = ?, distance = ?, image = ? WHERE id = ?',
      [name, distance, image, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
