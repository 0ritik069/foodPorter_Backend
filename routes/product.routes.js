const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/product.controller');
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
router.post('/', verifyToken, requireRole("restaurant"), productControllers.createProduct);

router.get('/', productControllers.getAllProducts);

router.get('/:id', verifyToken, requireRole("restaurant"), productControllers.getProductById);

router.put('/:id', verifyToken, requireRole("restaurant"), productControllers.updateProduct);

router.delete('/:id', verifyToken, requireRole("restaurant"), productControllers.deleteProduct);

module.exports = router;