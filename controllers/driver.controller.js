const fs = require('fs').promises;
const path = require('path');
const driverModel = require('../models/driver.model');

exports.createDriver = async (req, res) => {
    const profile_image = req.file ? req.file.filename : null;
    const imagePath = profile_image ? path.join(__dirname, '../uploads/drivers', profile_image) : null;
    try {
        const {
            user_id,
            vehicle_number,
            license_number,
            is_approved,
            rating,
        } = req.body;

        if (!user_id) {
            if (imagePath) await fs.unlink(imagePath);
            console('UserId is Required');
            return res.status(400).json({
                success: false,
                message: 'UserId is Required'
            });
        }

        if (!vehicle_number || !license_number) {
            if (imagePath) await fs.unlink(imagePath);
            console.log('Vehicle No. and License No. Both are required');
            return res.status(400).json({
                success: false,
                message: 'Vehicle No. and License No. Both are required'
            });
        }

        const isUserExists = await driverModel.checkUserExists(user_id);
        if (!isUserExists) {
            if (imagePath) await fs.unlink(imagePath);
            console.log(`User don't Exists. Driver can't Create...`);
            return res.status(400).json({
                success: false,
                message: `User don't Exists. Driver can't Create...`
            });
        }

        const driver = await driverModel.create_Driver({
            user_id,
            vehicle_number,
            license_number,
            profile_image,
            is_approved,
            rating,
        });

        console.log('Driver Created Successfully');
        return res.status(201).json({
            success: true,
            message: 'Driver Created Successfully',
            DriverId: driver.insertId,
            profile_image
        });
    } catch (error) {
        if (imagePath) await fs.unlink(imagePath);
        console.error('Creating Driver', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getAllDriver = async (req, res) => {
    try {
        const drivers = await driverModel.get_All_Driver();
        if (!drivers || drivers.length === 0) {
            console.log('Drivers Not Found.');
            return res.status({
                success: false,
                message: 'Drivers Not Found.',
            });
        }
        console.log('All Driver Fetched Successfully');
        return res.status(200).json({
            success: true,
            message: 'All Drivers Fetched Successfully',
            Drivers_data: drivers
        });
    } catch (error) {
        console.error('Fetching all driver:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const id = req.params.id;
        const driver = await driverModel.get_Driver_By_Id(id);
        if (!driver || driver.length === 0) {
            console.log('Driver Not Found');
            return res.status(400).json({
                success: false,
                message: 'Driver Not Found'
            });
        }
        console.log('Driver Fetched successfully');
        return res.status(200).json({
            success: true,
            message: 'Driver Fetched Successfully',
            Driver_Data: driver
        });
    } catch (error) {
        console.error('Fetching Driver', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateDriverById = async (req, res) => {
    const profile_image = req.file ? req.file.filename : null;
    const imagePath = profile_image ? path.join(__dirname, '../uploads/drivers', profile_image) : null;
    try {
        const {
            vehicle_number,
            license_number,
            is_approved,
            rating,
        } = req.body;

        const driverId = req.params.id;

        if (!vehicle_number || !license_number) {
            if (imagePath) await fs.unlink(imagePath);
            console.log('Vehicle No. and License No. Both are required');
            return res.status(400).json({
                success: false,
                message: 'Vehicle No. and License No. Both are required'
            });
        }
        const oldDriver = await driverModel.find_Driver_By_Id(driverId);
        if (!oldDriver) {
            if (imagePath) await fs.unlink(imagePath);
            console.log('Driver Not Found');
            return res.status(400).json({
                success: false,
                message: 'Driver Not Found'
            });
        }
        const updateDriver = await driverModel.update_Driver_By_Id(driverId,
            {
                vehicle_number,
                license_number,
                profile_image,
                is_approved,
                rating,
            }
        );
        if (!updateDriver || updateDriver.affectedRows === 0) {
            if (imagePath) await fs.unlink(imagePath);
            console.log('Update Failed!');
            return res.status(400).json({
                success: false,
                message: 'Update Failed'
            });
        }
        // Delete old profile image if new one is uploaded
        if (profile_image && oldDriver.profile_image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', 'drivers', oldDriver.profile_image);
            await fs.unlink(oldImagePath).catch(() => console.warn('Old image not found for deletion.'));
        }
        console.log('Driver Updated Successfully...');
        return res.status(200).json({
            success: true,
            message: 'Driver Updated Successfully...',
        });
    } catch (error) {
        console.log('Updating Driver', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteDriverById = async (req, res) => {
    try {
        const driverId = req.params.id;
        const driver = await driverModel.delete_Driver_By_id(driverId);

        if (!driver || driver.affectedRows === 0) {
            console.log('Driver Not Found');
            return res.status(400).json({
                success: false,
                message: 'Driver Not Found'
            });
        }
        //Delete the profile image if it exists
        if (driver.profile_image) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'drivers', driver.profile_image);
            await fs.unlink(imagePath).catch(() => {
                console.warn('Profile image not found or already deleted');
            });
        }
        console.log('Driver Deleted Successfully');
        return res.status(200).json({
            success: true,
            message: 'Driver Deleted Successfully'
        });

    } catch (error) {
        console.error('Driver Deleting', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getDriverProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const driverProfile = await driverModel.get_Driver_Profile(userId);
        if (!driverProfile || driverProfile.affectedRows === 0) {
            console.log('Driver Not Found!');
            return res.status(400).json({
                success: false,
                message: 'Driver Not Found!'
            });
        }
        console.log('Profile Fetched Successfully');
        return res.status(200).json({
            success: true,
            message: 'Profile Fetched Successfully',
            Profile: driverProfile
        });
    } catch (error) {
        console.error('Fetching Driver Profile', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getMyDeliveries = async (req, res) => {
    try {
        const driverId = req.user.id;
        const driverDeliveries = await driverModel.get_My_Deliveries(driverId);
        if (!driverDeliveries || driverDeliveries.length === 0) {
            console.log('No Deliveries Available Now!');
            return res.status(400).json({
                success: true,
                message: 'No Delaveries Avaliable Now!'
            });
        }
        console.log('Deliveries Fetched Successfully');
        return res.status(200).json({
            success: true,
            message: 'Deliveries Fetched Successfully',
            Delivarie_Data: driverDeliveries
        });
    } catch (error) {
        console.error('Fetching Driver Deliveries', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const {
            payment_method,
            payment_status,
            order_status
        } = req.body;

        if (!payment_method || !payment_status || !order_status) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            });
        }

        const result = await driverModel.update_Order_Status(orderId, {
            payment_method,
            payment_status,
            order_status
        });

        if (!result || result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Update Failed!'
            });
        }

        console.log('Order status updated successfully.');
        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully.'
        });
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.reviewRatingByCustomer = async (req, res) => {
    try {
        const customerId = req.user.id;
        let {
            order_id,
            driver_id,
            rating,
            review
        } = req.body;

        if (!order_id || !driver_id) {
            console.log('OrderId and DriverId Required');
            return res.status(400).json({
                success: false,
                message: 'OrderId and DriverId Required'
            });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            console.log('Rating must be a number between 1 and 5');
            return res.status(400).json({
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }

        const orderCheck = await driverModel.check_Customer_Order(order_id, customerId, driver_id);
        if (orderCheck.length === 0) {
            console.log('Order not found for this customer and driver');
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to rate this driver for this order.'
            });
        }

        const ratingAndReviews = await driverModel.rating_Reviews_By_Customer({
            order_id,
            customer_id: customerId,
            driver_id,
            rating: numericRating,
            review
        });

        if (!ratingAndReviews || ratingAndReviews.affectedRows === 0) {
            console.log('Failed Creating Review and Rating');
            return res.status(400).json({
                success: false,
                message: 'Failed Creating Review and Rating'
            });
        }

        console.log('Review and Rating Created...');
        return res.status(200).json({
            success: true,
            message: 'Review and Rating Created...',
            Id: ratingAndReviews.insertId
        });

    } catch (error) {
        console.error('Add Review and Rating', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getDriverRatingReview = async (req, res) => {
    try {
        const id = req.user.id;
        const driverRatingReview = await driverModel.get_Driver_Rating_Review(id);
        if (!driverRatingReview || driverRatingReview.length === 0) {
            console.log(`Reviews Not Found for DriverId:${id}`);
            return res.status(400).json({
                success: false,
                message: `Reviews Not Found for DriverId:${id}`
            });
        }
        console.log('Driver Reviews Fetched...');
        return res.status(200).json({
            success: true,
            message: 'Driver Reviews Fetched...',
            Data: driverRatingReview
        });

    } catch (error) {
        console.error('Fetching Reviews', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getCustomerContact = async (req, res) => {
    try {
        const orderId = req.params.id;
        const contact = await driverModel.get_Customer_Contact(orderId);
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: 'Customer Contact Not Found'
            });
        }

        console.log('Contact Fetched Successfully...');
        return res.status(200).json({
            success: true,
            message: 'Contact Fetched Successfully...',
            Contact: contact
        });

    } catch (error) {
        console.error('Fetching Customer Contact', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.sendMessageToCustomer = async (req, res) => {
    try {
        const driverId = req.user.id;
        const {
            to_customer_id,
            message,
        } = req.body;

        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: 'driver ID is required'
            });
        }

        if (!to_customer_id || !message) {
            return res.status(400).json({
                success: false,
                messages: 'Customer ID and message are required'
            });
        }

        const isCustomerExists = await driverModel.check_Customer_Exists(to_customer_id);
        if (!isCustomerExists || isCustomerExists.length === 0) {
            console.log(`Customer Not Exists. Message can't send`);
            return res.status(400).json({
                success: false,
                messages: `Customer Not Exists. Message can't send`
            });
        }

        const driverMessage = await driverModel.send_Message_To_Customer({
            from_driver_id: driverId,
            to_customer_id,
            message
        });

        if (!driverMessage || driverMessage.affectedRows === 0) {
            console.log('Message Not Send');
            return res.status(400).json({
                success: false,
                messages: 'Message Not Send'
            });
        }

        console.log('Message Sent Successfully...');
        return res.status(200).json({
            success: true,
            messages: 'Message Sent Successfully',
            id: driverMessage.insertId
        });

    } catch (error) {
        console.log('Sending Message', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getDriverEarnings = async (req, res) => {
    try {
        const driverId = req.user.id;
        const earnings = await driverModel.driver_Earnings(driverId);
        if (!earnings || earnings.length === 0) {
            console.log('Driver Earning Not Found');
            return res.status(400).json({
                success: false,
                message: 'Driver Earning Not Found',
            });
        }
        console.log('Total Earning get Successfully');
        return res.status(200).json({
            success: true,
            message: 'Total Earning get Successfully',
            Total_Earning: earnings
        });

    } catch (error) {
        console.error('Fetching Driver Earning', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getDriverMessages = async (req, res) => {
    try {
        const driverId = req.user.id;
        const driverMessage = await driverModel.get_All_Messages(driverId);
        if (!driverMessage || driverMessage.length === 0) {
            console.log('Messages Not Found');
            return res.status(400).json({
                success: false,
                message: 'Messages Not Found'
            });
        }
        console.log('Messages get Successfully');
        return res.status(200).json({
            success: true,
            message: 'Messages get Successfully',
            Messages: driverMessage
        });

    } catch (error) {
        console.error('Fetching Driver Messages', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateMessages = async (req, res) => {
    try {
        const {
            to_customer_id,
            message,
            id
        } = req.body;

        if (!to_customer_id || !message || !id) {
            console.log('All Fields are required..');
            return res.status(400).json({
                success: false,
                messages: 'All Fields are required'
            });
        }

        const isCustomerExists = await driverModel.check_Customer_Exists(to_customer_id);
        if (!isCustomerExists || isCustomerExists.length === 0) {
            console.log(`Customer Not Found. can't Update`)
            return res.status(400).json({
                success: false,
                messages: `Customer Not Found. can't Update`
            });
        }

        const messageUpdate = await driverModel.update_Messages(id, {
            to_customer_id,
            message,
        });

        if (!messageUpdate || messageUpdate.affectedRows === 0) {
            console.log('Messages Not Update');
            return res.status(400).json({
                success: false,
                messages: 'Messages Not Update'
            });
        }
        console.log('Messages Updated Successfully');
        return res.status(200).json({
            success: true,
            messages: 'Messages Updated Successfully'
        });

    } catch (error) {
        console.error('Updating messages', error);
        return res.status(500).json({
            success: false,
            messages: 'Internal Server Error'
        });
    }
};
