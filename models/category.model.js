const pool = require('../config/db');

const Category = {
  create: async ({ name, restaurant_id }) => {
    const [result] = await pool.query(
      'INSERT INTO categories (name, restaurant_id) VALUES (?, ?)',
      [name, restaurant_id]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query(`
      Select * from categories
      `);
    return rows;
  },


  findById: async (restaurant_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = ?',
      [restaurant_id]
    );
    return rows[0];
  },



  update: async (id, name) => {
    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
