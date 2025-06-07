const Category = require('../models/category.model');

const BASE_URL = 'http://192.168.1.80:5000'; // Change this accordingly

exports.createCategory = async (req, res) => {
  try {
    const { name, distance } = req.body;
    const restaurant_id = req.params.restaurant_id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    let image = null;
    if (req.file) {
      image = `${BASE_URL}/uploads/categories/${req.file.filename}`;
    }

    const categoryId = await Category.create({ name, restaurant_id, image, distance });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: categoryId,
        name,
        restaurant_id,
        image,
        distance
      }
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    // Map image to full URL if exists
    const categoriesWithImageURL = categories.map(cat => {
      if (cat.image && !cat.image.startsWith('http')) {
        cat.image = `${BASE_URL}/uploads/categories/${cat.image}`;
      }
      return cat;
    });

    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categoriesWithImageURL
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getCategoriesById = async (req, res) => {
  try {
    const restaurant_id = req.params.restaurant_id;

    const categories = await Category.findById(restaurant_id);

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for this restaurant"
      });
    }

    // Add full image URL
    const categoriesWithImageURL = categories.map(cat => {
      if (cat.image && !cat.image.startsWith('http')) {
        cat.image = `${BASE_URL}/uploads/categories/${cat.image}`;
      }
      return cat;
    });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categoriesWithImageURL
    });
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, distance } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename; // will store filename in DB
    }

    await Category.update(categoryId, { name, distance, image });

    // Fetch updated category to send full data with image URL
    const updatedCategory = await Category.findByIdByCategoryId(categoryId);

    if (updatedCategory.image && !updatedCategory.image.startsWith('http')) {
      updatedCategory.image = `${BASE_URL}/uploads/categories/${updatedCategory.image}`;
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.delete(categoryId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: {
        id: categoryId
      }
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
