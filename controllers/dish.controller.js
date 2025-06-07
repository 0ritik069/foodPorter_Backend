const Dish = require('../models/dish.model');


exports.createDish = async (req, res) => {
  try {
    const restaurant_id = req.user.id; // from JWT
    const { name, description, price, image, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category_id are required',
      });
    }

    const id = await Dish.create({
      name,
      description,
      price,
      image,
      category_id,
      restaurant_id,
    });

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: {
        id,
        name,
        description,
        price,
        image,
        category_id,
        restaurant_id,
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
    res.status(200).json({
      success: true,
      message: 'All dishes fetched successfully',
      data: dishes,
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
    const dishId = req.params.id;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
      });
    }

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
    const updateData = req.body;

    await Dish.update(dishId, updateData);

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully',
      data: {
        id: dishId,
        ...updateData,
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
      data: {
        id: dishId,
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
