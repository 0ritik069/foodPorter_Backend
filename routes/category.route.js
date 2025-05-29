// category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
// NO need to repeat `/categories` here
router.post('/', verifyToken, requireRole("restaurant"), categoryController.createCategory);
router.get('/', verifyToken, requireRole("restaurant"), categoryController.getAllCategories);
router.get('/:id', verifyToken, requireRole("restaurant"), categoryController.getCategoriesById);
router.put('/:id', verifyToken, requireRole("restaurant"), categoryController.updateCategory);
router.delete('/:id', verifyToken, requireRole("restaurant"), categoryController.deleteCategory);

module.exports = router;
