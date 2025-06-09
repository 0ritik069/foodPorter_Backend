const pool = require('../config/db');

const Dish = {
  create: async ({ name, description, price, image, category_id, restaurant_id }) => {
    const [result] = await pool.query(
      'INSERT INTO dishes (name, description, price, image, category_id, restaurant_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category_id, restaurant_id]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM dishes');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM dishes WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { name, description, price, image, is_available, category_id } = data;
    await pool.query(
      'UPDATE dishes SET name = ?, description = ?, price = ?, image = ?, is_available = ?, category_id = ? WHERE id = ?',
      [name, description, price, image, is_available, category_id, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM dishes WHERE id = ?', [id]);
  },

   findByCategoryId: async (category_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM dishes WHERE category_id = ?',
      [category_id]
    );
    return rows;
  },
};

module.exports = Dish;
