const Dish = require('../models/dish.model');
const pool = require('../config/db');
const baseUrl = "http://192.168.1.80:5000/uploads/dishes/";

exports.createDish = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category_id are required',
      });
    }

    
    const [[restaurant]] = await pool.query(
      'SELECT id FROM restaurants WHERE owner_user_id = ?',
      [req.user.id]
    );

    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant not found for this user.',
      });
    }

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const id = await Dish.create({
      name,
      description,
      price,
      image,
      category_id,
      restaurant_id: restaurant.id,
    });

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: {
        id,
        name,
        description,
        price,
        image: image ? baseUrl + image : null,
        category_id,
        restaurant_id: restaurant.id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.findAll();
    const formatted = dishes.map(d => ({
      ...d,
      image: d.image ? baseUrl + d.image : null
    }));
    res.status(200).json({
      success: true,
      message: 'All dishes fetched successfully',
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
      });
    }
    dish.image = dish.image ? baseUrl + dish.image : null;

    res.status(200).json({
      success: true,
      message: 'Dish fetched successfully',
      data: dish,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const { name, description, price, category_id, is_available } = req.body;
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }
    const updateData = {
      name,
      description,
      price,
      category_id,
      is_available: is_available !== undifined ? is_available  : true, 
    }

    await Dish.update(dishId, updateData);

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully',
      data: {
        id: dishId,
        ...updateData,
        image: image ? baseUrl + image : null
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    await Dish.delete(dishId);

    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully',
      data: { id: dishId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



exports.getDishesByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;

    const dishes = await Dish.findByCategoryId(category_id);

    if (!dishes.length) {
      return res.status(404).json({
        success: false,
        message: "No dishes found in this category"
      });
    }

    const formattedDishes = dishes.map(d => ({
      ...d,
      image: d.image ? `${baseUrl}/uploads/dishes/${d.image}` : null
    }));

    res.status(200).json({
      success: true,
      message: "Dishes fetched successfully",
      data: formattedDishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


exports.getDishesByRestaurantId = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const dishes = await Dish.findByRestaurantId(restaurant_id);

    if (!dishes.length) {
      return res.status(404).json({
        success: false,
        message: "No dishes found for this restaurant"
      });
    }

    const formatted = dishes.map(d => ({
      ...d,
      image: d.image ? baseUrl + d.image : null
    }));

    res.status(200).json({
      success: true,
      message: "Dishes fetched successfully",
      data: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


exports.getDishesByCategoryAndRestaurant = async (req, res) => {
  try {
    const { category_id, restaurant_id } = req.params;

    const dishes = await Dish.findByCategoryAndRestaurant(category_id, restaurant_id);

    if (!dishes.length) {
      return res.status(404).json({
        success: false,
        message: "No dishes found for this category and restaurant"
      });
    }

    const formatted = dishes.map(d => ({
      ...d,
      image: d.image ? baseUrl + d.image : null
    }));

    res.status(200).json({
      success: true,
      message: "Dishes fetched successfully",
      data: formatted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
