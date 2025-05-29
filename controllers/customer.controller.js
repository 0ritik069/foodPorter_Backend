// src/controllers/customer.controller.js

const Customer = require('../models/customer.model');

exports.createCustomer = async (req, res) => {
  try {
    const id = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created', customerId: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    await Customer.update(req.params.id, req.body);
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.delete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
