const pool = require('../config/db');

const Order = {
  create: async ({ customer_id, restaurant_id, total_price, payment_method }) => {
    const [result] = await pool.query(
      'INSERT INTO orders (customer_id, restaurant_id, total_price, payment_method) VALUES (?, ?, ?, ?)',
      [customer_id, restaurant_id, total_price, payment_method]
    );
    return result.insertId;
  },

  addItem: async ({ order_id, product_id, quantity, price }) => {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, product_id, quantity, price]
    );
  },

  getCustomerOrders: async (customer_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [customer_id]
    );
    return rows;
  },

  getOrderItems: async (order_id) => {
    const [rows] = await pool.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order_id]
    );
    return rows;
  }
};

module.exports = Order;
