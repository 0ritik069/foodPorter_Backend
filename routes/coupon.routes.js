const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

router.post('/apply', couponController.applyCoupon); // POST /api/coupon/apply

module.exports = router;
