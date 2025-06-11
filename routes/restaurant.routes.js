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


router.post('/', upload.single('image'), createRestaurant);


router.put('/:id', upload.single('image'), updateRestaurant);


router.get('/', getAllRestaurants);
router.get('/filters', getFilteredRestaurants);
router.get('/:id', getRestaurantById);


// router.delete('/:id', deleteRestaurant);

module.exports = router;
