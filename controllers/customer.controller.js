const Customer = require('../models/customer.model');
const pool = require('../config/db'); 

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

exports.getCustomerHome = async (req, res) => {
  try {
    const topRatedQuery = `SELECT id, name, image, rating FROM restaurants ORDER BY rating DESC LIMIT 10`;
    const discountQuery = `SELECT id, name, image, discount FROM restaurants WHERE discount > 0 ORDER BY discount DESC LIMIT 10`;
    const categoriesQuery = `SELECT id, name FROM categories`;
    const recommendedQuery = `SELECT id, name, image, rating FROM restaurants ORDER BY RAND() LIMIT 8`;
    const trendingDishesQuery = `SELECT id, name, image, price FROM products WHERE isTrending = 1 LIMIT 10`;

    
    const [topRated] = await pool.query(topRatedQuery);
    const [discounts] = await pool.query(discountQuery);
    const [categories] = await pool.query(categoriesQuery);
    const [recommended] = await pool.query(recommendedQuery);
    const [trendingDishes] = await pool.query(trendingDishesQuery);

    res.status(200).json({
      success: true,
      message: "Home data fetched successfully",
      data: {
        topRatedRestaurants: topRated,
        discounts,
        categories,
        recommended,
        trendingDishes
      }
    });
  } catch (error) {
    console.error("Home API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch home data",
      error: error.message
    });
  }
};
