const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const upload = require('../middleware/upload');


router.post(
  '/',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  dishController.createDish
);


router.put(
  '/:id',
  verifyToken,
  requireRole("restaurant"),
  upload.single('image'),
  dishController.updateDish
);

router.delete(
  '/:id',
  verifyToken,
  requireRole("restaurant"),
  dishController.deleteDish
);

router.get('/category/:category_id/restaurant/:restaurant_id', dishController.getDishesByCategoryAndRestaurant);



router.get('/restaurant/:restaurant_id', dishController.getDishesByRestaurantId);

router.get('/category/:category_id', dishController.getDishesByCategoryId);

router.get('/', dishController.getAllDishes);

router.get('/:id', dishController.getDishById);

module.exports = router;
