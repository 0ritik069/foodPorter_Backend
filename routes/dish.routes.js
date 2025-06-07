const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");


router.post('/', verifyToken, requireRole("restaurant"), dishController.createDish);

router.get('/',  dishController.getAllDishes);


router.get('/:id', dishController.getDishById);


router.put('/:id', verifyToken, requireRole("restaurant"), dishController.updateDish);


router.delete('/:id', verifyToken, requireRole("restaurant"), dishController.deleteDish);

module.exports = router;
