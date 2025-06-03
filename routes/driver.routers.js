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

router.post('/review_rating', verifyToken, requireRole('customer'), driverController.reviewRatingByCustomer);
router.get('/get_reviews', verifyToken, requireRole('driver'), driverController.getDriverRatingReview);

router.get('/customer_contact/:id', driverController.getCustomerContact);
router.post('/message_to_customer', verifyToken, requireRole('driver'), driverController.sendMessageToCustomer);
router.get('/total_earning', verifyToken, requireRole('driver'), driverController.getDriverEarnings);
router.get('/all_messages', verifyToken, requireRole('driver'), driverController.getDriverMessages);
router.post('/update_messages', verifyToken, requireRole('driver'), driverController.updateMessages);

router.post('/notification', verifyToken, requireRole('driver'), driverController.sendNotification);
router.get('/my_notification', verifyToken, requireRole('driver'), driverController.getDriverNotification);
router.post('/update_notification', verifyToken, requireRole('driver'), driverController.updateDriverNotification);
router.post('/delete_notification/:id', verifyToken, requireRole('driver'), driverController.deleteNotifications);

module.exports = router;
