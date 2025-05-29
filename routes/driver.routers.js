const express = require('express');
const router = express();
const driverController = require('../controllers/driver.controller');
const upload = require('../middleware/upload');


router.post('/create', upload.single('profile_image'), driverController.createDriver);
router.get('/get_list', driverController.getAllDriver);
router.get('/get/:id', driverController.getDriverById);
router.put('/update/:id', upload.single('profile_image'), driverController.updateDriverById);
router.delete('/delete/:id', driverController.deleteDriverById);

module.exports = router;
