// routes/cart.routes.js
const express = require('express');
const router  = express.Router();
const cartCtl = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/add',  verifyToken, cartCtl.addToCart);
router.get('/',      verifyToken, cartCtl.getCart);

module.exports = router;
