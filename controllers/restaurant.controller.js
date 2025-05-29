const Restaurant = require('../models/restaurant.model');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, phone, image,status,email,ownerName} = req.body;
    const id = await Restaurant.create({ name, address, phone, image ,status,email,ownerName});
    res.status(201).json({ message: 'Restaurant created', id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating restaurant', error: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { name, address, phone, image,status,email,ownerName } = req.body;
    await Restaurant.update(req.params.id, { name, address, phone, image,status,email,ownerName });
    res.json({ message: 'Restaurant updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating restaurant' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.delete(req.params.id);
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting restaurant' });
  }
};
