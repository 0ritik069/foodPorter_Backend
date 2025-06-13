// models/cart.model.js
const pool = require('../config/db');

const Cart = {
  /** Add dish or increment quantity */
  addOrUpdate: async (user_id, dish_id) => {
    const [rows] = await pool.query(
      'SELECT id FROM carts WHERE user_id = ? AND dish_id = ?',
      [user_id, dish_id]
    );

    if (rows.length) {
      await pool.query(
        'UPDATE carts SET quantity = quantity + 1 WHERE user_id = ? AND dish_id = ?',
        [user_id, dish_id]
      );
    } else {
      await pool.query(
        'INSERT INTO carts (user_id, dish_id, quantity) VALUES (?, ?, 1)',
        [user_id, dish_id]
      );
    }
  },

  /** Get full cart with dish details */
  getUserCart: async (user_id) => {
    const [rows] = await pool.query(`
      SELECT c.quantity,
             d.id   AS dish_id,
             d.name,
             d.price,
             d.image
      FROM carts c
      JOIN dishes d ON d.id = c.dish_id
      WHERE c.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  removeDish: async (user_id, dish_id) =>
    pool.query('DELETE FROM carts WHERE user_id = ? AND dish_id = ?', [user_id, dish_id]),

  clearCart:  async (user_id) => pool.query('DELETE FROM carts WHERE user_id = ?', [user_id])
};

module.exports = Cart;
