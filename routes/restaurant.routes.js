const express = require('express');

const router = express.Router();

const { getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurant.controller');






// Get all restaurants
router.get('/',getAllRestaurants);

// Get restaurant by ID
router.get('/:id', getRestaurantById);

//create a new restaurants
router.post('/', createRestaurant);

//update a restaurant
router.put('/:id', updateRestaurant);

//delete a restaurant
router.delete('/:id',deleteRestaurant);

module.exports=router;