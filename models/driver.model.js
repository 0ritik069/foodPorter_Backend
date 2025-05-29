const db = require('../config/db');

exports.create_Driver = async (driverData) => {
    const [rows] = await db.execute(
        `INSERT INTO drivers (user_id, vehicle_number, license_number, profile_image, is_approved, rating, total_earnings)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            driverData.user_id,
            driverData.vehicle_number || null,
            driverData.license_number || null,
            driverData.profile_image || null,
            driverData.is_approved || null,
            driverData.rating || null,
            driverData.total_earnings || null
        ]
    );
    return rows;
};

exports.checkUserExists = async (user_id) => {
    const [rows] = await db.execute(
        `SELECT id FROM users WHERE id = ?`,
        [
            user_id
        ]
    );
    return rows[0];
};

exports.get_All_Driver = async () => {
    const [rows] = await db.execute(
        `SELECT d.*, u.name AS user_name, u.email 
    FROM drivers d
    JOIN users u ON d.user_id = u.id`
    );
    return rows;
};

exports.get_Driver_By_Id = async (id) => {
    const [rows] = await db.execute(
        `SELECT d.*, u.name AS user_name, u.email 
    FROM drivers d
    JOIN users u ON d.user_id = u.id where d.id = ?`,
        [
            id
        ]
    );
    return rows[0];
};

exports.find_Driver_By_Id = async (driverId) => {
    const [rows] = await db.execute(
        `SELECT * FROM drivers WHERE id = ?`, [driverId]
    );
    return rows[0];
};

exports.update_Driver_By_Id = async (id, driverData) => {
    const [rows] = await db.execute(
        `UPDATE drivers set vehicle_number = ?, license_number = ?, profile_image = ?,
        is_approved = ?, rating = ?, total_earnings = ? WHERE id = ?`,
        [
            driverData.vehicle_number || null,
            driverData.license_number || null,
            driverData.profile_image || null,
            driverData.is_approved || null,
            driverData.rating || null,
            driverData.total_earnings || null,
            id
        ]
    );
    return rows;
};

exports.delete_Driver_By_id = async (driverId) => {
    const [rows] = await db.execute(
        `DELETE FROM drivers WHERE id = ?`,
        [
            driverId
        ]
    );
    return rows;
};
