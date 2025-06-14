const express = require('express');

const router= express.Router();

const customerController = require("../controllers/customer.controller");

router.post('/' , customerController.createCustomer);
router.get('/home', customerController.getCustomerHome);
router.get('/',customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id',customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);


module.exports=router;