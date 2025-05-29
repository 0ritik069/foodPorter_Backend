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
            total_earnings
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
            total_earnings
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
            total_earnings
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
            console.log('Driver Nor Found');
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
                total_earnings
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
