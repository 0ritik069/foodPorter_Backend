const BASE_URL = 'http://192.168.1.80:5000';  // <-- change this to your backend IP and port
const Restaurant = require('../models/restaurant.model');


exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, phone, status, email, ownerName } = req.body;

    let image = null;
    if (req.file) {
      // Instead of only filename, send full URL here
      image = `${BASE_URL}/uploads/restaurants/${req.file.filename}`;
    }

    const id = await Restaurant.create({ name, address, phone, image, status, email, ownerName });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: {
        id,
        name,
        address,
        phone,
        image,
        status,
        email,
        ownerName,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating restaurant',
      error: err.message,
    });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    // Map through restaurants and update image field to full URL if image exists
    const restaurantsWithFullUrl = restaurants.map(r => {
      if (r.image) {
        r.image = `${BASE_URL}/uploads/restaurants/${r.image}`;
      }
      return r;
    });

    res.status(200).json({
      success: true,
      message: 'All restaurants fetched successfully',
      data: restaurantsWithFullUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
      error: err.message,
    });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Update image to full URL
    if (restaurant.image) {
      restaurant.image = `${BASE_URL}/uploads/restaurants/${restaurant.image}`;
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant fetched successfully',
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant',
      error: err.message,
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { name, address, phone, status, email, ownerName } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename; // store filename for DB update
    }

    await Restaurant.update(req.params.id, { name, address, phone, image, status, email, ownerName });

    // Fetch updated restaurant to get full image URL
    const updatedRestaurant = await Restaurant.findById(req.params.id);
    if (updatedRestaurant.image) {
      updatedRestaurant.image = `${BASE_URL}/uploads/restaurants/${updatedRestaurant.image}`;
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: updatedRestaurant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating restaurant',
      error: err.message,
    });
  }
};
