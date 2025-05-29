const pool = require('../config/db'); 

const Product = {
  create: async ({ name, description, price, image, category_id, restaurant_id }) => {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, image, category_id, restaurant_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category_id, restaurant_id]
    );
    return result.insertId;
  },

  findAll: async (restaurant_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE restaurant_id = ?',
      [restaurant_id]
    );
    return rows;
  },

  findById: async (id)=>{
    const [rows] = await pool.query('Select * from product where id = ?', [id]);
    return rows[0];
},

  update: async (id, data) => {
    const { name, description, price, image, is_available } = data;
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, is_available = ? WHERE id = ?',
      [name, description, price, image, is_available, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },
};

module.exports = Product;
