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
    const [rows] = await pool.query('SELECT * FROM categories WHERE restaurant_id = ?', [restaurant_id]);
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

  findRestaurantsByCategoryName: async (categoryName) => {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.name,
        r.image,
        r.address,
        r.rating,
        r.discount,
        r.estimated_delivery_time,
        MIN(d.price) AS starting_price
      FROM categories c
      JOIN restaurants r ON c.restaurant_id = r.id
      JOIN dishes d ON d.restaurant_id = r.id AND d.category_id = c.id
      WHERE c.name = ?
      GROUP BY r.id, r.name, r.image, r.address, r.rating, r.discount, r.estimated_delivery_time
    `, [categoryName]);

    return rows;
  }
};

module.exports = Category;
