const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFilteredRestaurants
} = require('../controllers/restaurant.controller');

// Upload image when creating restaurant
router.post('/', upload.single('image'), createRestaurant);

// Upload image when updating restaurant
router.put('/:id', upload.single('image'), updateRestaurant);

// Other routes
router.get('/', getAllRestaurants);
router.get('/filters', getFilteredRestaurants);
router.get('/:id', getRestaurantById);


// router.delete('/:id', deleteRestaurant);

module.exports = router;
