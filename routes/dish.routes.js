const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const upload = require('../middleware/upload');

// ✅ CREATE dish (only for restaurants)
router.post(
  '/',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  dishController.createDish
);

// ✅ UPDATE dish by ID
router.put(
  '/:id',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  dishController.updateDish
);

// ✅ DELETE dish by ID
router.delete(
  '/:id',
  verifyToken,
  requireRole("restaurant"),
  dishController.deleteDish
);

// ⚠️ IMPORTANT: Put specific routes BEFORE /:id to avoid conflicts

// ✅ Get dishes by Restaurant ID
router.get('/restaurant/:restaurant_id', dishController.getDishesByRestaurantId);

// ✅ Get dishes by Category ID
router.get('/category/:category_id', dishController.getDishesByCategoryId);

// ✅ Get all dishes (public)
router.get('/', dishController.getAllDishes);

// ✅ Get dish by ID (last to avoid route conflicts)
router.get('/:id', dishController.getDishById);

module.exports = router;
