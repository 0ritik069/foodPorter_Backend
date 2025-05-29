const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
// const verifyToken = require('../middleware/auth.middleware').verifyToken;

router.post('/', orderController.placeOrder);
router.get('/', orderController.getMyOrders);

module.exports = router;
