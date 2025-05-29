// src/models/customer.model.js

const pool = require('../config/db');

const Customer = {
  create: async (data) => {
    const [result] = await pool.query(
      `INSERT INTO customers (name, email, password, phone) VALUES (?, ?, ?, ?)`,
      [data.name, data.email, data.password, data.phone]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [rows] = await pool.query(`SELECT id, name, email, phone FROM customers`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`SELECT id, name, email, phone FROM customers WHERE id = ?`, [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const [result] = await pool.query(
      `UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?`,
      [data.name, data.email, data.phone, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query(`DELETE FROM customers WHERE id = ?`, [id]);
    return result;
  }
};

module.exports = Customer;
