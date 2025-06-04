const express = require('express');
const router = express.Router();
// const upload = require('../upload');

const { loginCustomer, loginDriver, loginRestaurant,loginAdmin } = require('../controllers/login.controller');
const signup = require("../controllers/signup.controller");


router.post('/signup',signup);

router.post('/login/customer', loginCustomer);


router.post('/login/driver', loginDriver);


router.post('/login/restaurant', loginRestaurant);

router.post('/login/admin', loginAdmin);

module.exports = router;
