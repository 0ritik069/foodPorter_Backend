const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Create category (with image)
router.post(
  '/',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  categoryController.createCategory
);

// Get all categories (admin or global access)
router.get('/', categoryController.getAllCategories);

// Get categories for specific restaurant
router.get('/:restaurant_id', categoryController.getCategoriesByRestaurant);

// Update category
router.put(
  '/:id',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  categoryController.updateCategory
);

// Delete category
router.delete('/:id', verifyToken, requireRole("restaurant"), categoryController.deleteCategory);

module.exports = router;
