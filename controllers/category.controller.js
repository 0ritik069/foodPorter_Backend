const Category = require('../models/category.model');
const BASE_URL = 'http://192.168.1.80:5000';
const pool = require('../config/db');

exports.createCategory = async (req, res) => {
  try {
    const { name, distance } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const [restaurantRows] = await pool.query(
      'SELECT id FROM restaurants WHERE owner_user_id = ?',
      [req.user.id]
    );

    if (restaurantRows.length === 0) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this user" });
    }

    const restaurant_id = restaurantRows[0].id;

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const categoryId = await Category.create({ name, restaurant_id, image, distance });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: categoryId,
        name,
        restaurant_id,
        image: image ? `${BASE_URL}/uploads/categories/${image}` : null,
        distance
      }
    });

  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    const categoriesWithImage = categories.map(c => ({
      ...c,
      image: c.image ? `${BASE_URL}/uploads/categories/${c.image}` : null
    }));

    res.status(200).json({
      success: true,
      message: "All categories fetched",
      data: categoriesWithImage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getCategoriesByRestaurant = async (req, res) => {
  try {
    const restaurant_id = req.params.restaurant_id;
    const categories = await Category.findByRestaurantId(restaurant_id);

    if (!categories.length) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }

    const formatted = categories.map(c => ({
      ...c,
      image: c.image ? `${BASE_URL}/uploads/categories/${c.image}` : null
    }));

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, distance } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    await Category.update(id, { name, distance, image });

    const updated = await Category.findByCategoryId(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    updated.image = updated.image ? `${BASE_URL}/uploads/categories/${updated.image}` : null;

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.delete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getRestaurantsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName.trim();

    const restaurants = await Category.findRestaurantsByCategoryName(categoryName);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found with category '${categoryName}'`
      });
    }

    const formatted = restaurants.map(r => ({
      ...r,
      image: r.image ? `${BASE_URL}/uploads/restaurants/${r.image}` : null,
      estimated_delivery_time: `${r.estimated_delivery_time} min`,
      discount: `${r.discount}% OFF`,
      free_delivery: true,
      starting_price: `Rs.${r.starting_price}`
    }));

    res.status(200).json({
      success: true,
      message: `Restaurants offering ${categoryName}`,
      data: formatted
    });

  } catch (error) {
    console.error("Error in getRestaurantsByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};



