const express = require('express');
const router = express();
const driverController = require('../controllers/driver.controller');
const upload = require('../middleware/upload');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');


router.post('/create', upload.single('profile_image'), driverController.createDriver);
router.get('/get_list', driverController.getAllDriver);
router.get('/get/:id', driverController.getDriverById);
router.put('/update/:id', upload.single('profile_image'), driverController.updateDriverById);
router.delete('/delete/:id', driverController.deleteDriverById);

router.get('/profile', verifyToken, requireRole('driver'), driverController.getDriverProfile);
router.get('/my_deliveries', verifyToken, requireRole('driver'), driverController.getMyDeliveries);
router.post('/update_order_status/:id', verifyToken, requireRole('driver'), driverController.updateOrderStatus);

module.exports = router;
