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

   getFilteredRestaurants: async (type) => {
    let query = `SELECT * FROM restaurants WHERE status = 'open'`;

    switch (type) {
      case 'top':
        query += ` ORDER BY rating DESC LIMIT 10`;
        break;

      case 'new':
        query += ` ORDER BY created_at DESC LIMIT 10`;
        break;

      case 'pickup':
        query += ` AND is_pickup_available = 1`;
        break;

      case 'under30':
        query += ` AND estimated_delivery_time <= 30`;
        break;

      case 'above200':
        query = `
          SELECT DISTINCT r.* 
          FROM restaurants r
          JOIN dishes d ON r.id = d.restaurant_id
          WHERE d.price > 200 AND r.status = 'open'
        `;
        break;

      case 'under200':
        query = `
          SELECT DISTINCT r.* 
          FROM restaurants r
          JOIN dishes d ON r.id = d.restaurant_id
          WHERE d.price <= 200 AND r.status = 'open'
        `;
        break;

      default:
        // Show all open restaurants if no type or unknown type
        query = `SELECT * FROM restaurants WHERE status = 'open'`;
        break;
    }

    const [rows] = await pool.query(query);
    return rows;
  }
  
};

module.exports = Restaurant;
