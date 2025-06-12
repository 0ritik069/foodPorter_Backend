const pool = require('../config/db');

const Cart = {
  addOrUpdate: async (user_id, dish_id) => {
    // check if already in cart
    const [rows] = await pool.query(
      'SELECT * FROM carts WHERE user_id = ? AND dish_id = ?',
      [user_id, dish_id]
    );

    if (rows.length > 0) {
      await pool.query(
        'UPDATE carts SET quantity = quantity + 1 WHERE user_id = ? AND dish_id = ?',
        [user_id, dish_id]
      );
    } else {
      await pool.query(
        'INSERT INTO carts (user_id, dish_id, quantity) VALUES (?, ?, ?)',
        [user_id, dish_id, 1]
      );
    }
  },

  getUserCart: async (user_id) => {
    const [rows] = await pool.query(`
      SELECT c.id, c.quantity, d.id AS dish_id, d.name, d.price, d.image
      FROM carts c
      JOIN dishes d ON c.dish_id = d.id
      WHERE c.user_id = ?
    `, [user_id]);

    return rows;
  },

  removeDish: async (user_id, dish_id) => {
    await pool.query(
      'DELETE FROM carts WHERE user_id = ? AND dish_id = ?',
      [user_id, dish_id]
    );
  },

  clearCart: async (user_id) => {
    await pool.query('DELETE FROM carts WHERE user_id = ?', [user_id]);
  }
};

module.exports = Cart;
