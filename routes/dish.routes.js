const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const upload = require('../middleware/upload');

router.post('/', verifyToken, requireRole("restaurant"), upload.single('image'), dishController.createDish);
router.put('/:id', verifyToken, requireRole("restaurant"), upload.single('image'), dishController.updateDish);
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.delete('/:id', verifyToken, requireRole("restaurant"), dishController.deleteDish);

// routes/dish.routes.js
router.get('/category/:category_id', dishController.getDishesByCategoryId);


module.exports = router;
