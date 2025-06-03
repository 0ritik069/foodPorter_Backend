const db = require('../config/db');

exports.create_Driver = async (driverData) => {
    const [rows] = await db.execute(
        `INSERT INTO drivers (user_id, vehicle_number, license_number, profile_image, is_approved, rating)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            driverData.user_id,
            driverData.vehicle_number || null,
            driverData.license_number || null,
            driverData.profile_image || null,
            driverData.is_approved || null,
            driverData.rating || null
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
        is_approved = ?, rating = ? WHERE id = ?`,
        [
            driverData.vehicle_number || null,
            driverData.license_number || null,
            driverData.profile_image || null,
            driverData.is_approved || null,
            driverData.rating || null,
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

exports.get_Driver_Profile = async (userId) => {
    const [rows] = await db.execute(
        `SELECT d.id, u.name as Name, u.email as Email, d.vehicle_number, d.license_number, d.is_approved, 
        d.rating, d.profile_image FROM drivers d
    JOIN users u ON d.user_id = u.id where u.id = ?`, [userId]
    );
    return rows;
};

exports.get_My_Deliveries = async (driverId) => {
    const [rows] = await db.execute(
        ` SELECT 
        id,
        customer_id,
        restaurant_id,
        total_price,
        payment_method,
        payment_status,
        order_status,
        created_at
      FROM orders
      WHERE driver_id = ?
      ORDER BY created_at DESC`,
        [
            driverId
        ]
    );
    return rows;
};

exports.update_Order_Status = async (id, data) => {
    const [rows] = await db.execute(
        `UPDATE orders SET 
        payment_method = ?, payment_status = ?, order_status = ? WHERE id = ?`,
        [
            data.payment_method,
            data.payment_status,
            data.order_status,
            id
        ]
    );
    return rows;
};

exports.rating_Reviews_By_Customer = async (data) => {
    const [rows] = await db.execute(
        `INSERT INTO driver_reviews (order_id, customer_id, driver_id, rating, review)
        VALUES (?, ?, ?, ?, ?)`,
        [
            data.order_id,
            data.customer_id,
            data.driver_id,
            data.rating || null,
            data.review || null
        ]
    );
    return rows;
};

exports.check_Customer_Order = async (order_id, customerId, driver_id) => {
    const [rows] = await db.execute(
        `SELECT * FROM orders WHERE id = ? AND customer_id = ? AND driver_id = ?`,
        [order_id, customerId, driver_id]
    );
    return rows;
};

exports.get_Driver_Rating_Review = async (id) => {
    const [rows] = await db.execute(
        `SELECT * FROM driver_reviews WHERE driver_id = ?`,
        [
            id
        ]
    );
    return rows;
};

exports.get_Customer_Contact = async (orderId) => {
    const [rows] = await db.query(
        `SELECT customers.id AS customer_id, customers.phone 
     FROM orders
     JOIN customers ON orders.customer_id = customers.user_id
     WHERE orders.id = ?`,
        [orderId]
    );
    return rows[0];
};

exports.send_Message_To_Customer = async (data) => {
    const [rows] = await db.execute(
        `INSERT INTO messages (from_driver_id, to_customer_id, message, sent_at)
     VALUES (?, ?, ?, NOW())`,
        [
            data.from_driver_id || null,
            data.to_customer_id || null,
            data.message || null
        ]
    );
    return rows;
};

exports.check_Customer_Exists = async (id) => {
    const [rows] = await db.execute(
        `select id from customers where id = ?`,
        [
            id
        ]
    );
    return rows;
};

exports.driver_Earnings = async (driverId) => {
    const [rows] = await db.execute(
        `SELECT SUM(o.total_earnings) AS Total_Earnings
     FROM orders o
     WHERE o.driver_id = ? AND o.order_status = 'delivered'`,
        [
            driverId
        ]
    );
    return rows;
};

exports.get_All_Messages = async (driverId) => {
    const [rows] = await db.execute(
        `select * from messages where from_driver_id = ?`,
        [
            driverId
        ]
    );
    return rows;
};

exports.update_Messages = async (id, data) => {
    const [rows] = await db.execute(
        `UPDATE messages set to_customer_id = ?, message = ? where id = ?`,
        [
            data.to_customer_id || null,
            data.message || null,
            id
        ]
    );
    return rows;
};

exports.send_Notification = async (data) => {
    const [rows] = await db.execute(
        `INSERT INTO notifications (sender_id, receiver_id, sender_type, receiver_type, message)
        VALUES (?, ?, ?, ?, ?)`,
        [
            data.sender_id,
            data.receiver_id,
            data.sender_type,
            data.receiver_type,
            data.message
        ]
    );
    return rows;
};

exports.get_Driver_Notification = async (driverId) => {
    const [rows] = await db.execute(
        `SELECT id, receiver_id, receiver_type, message, created_at from notifications 
        WHERE sender_id = ? and sender_type = 'driver'`,
        [
            driverId
        ]
    );
    return rows;
};

exports.update_Driver_Notification = async (data) => {
    const [rows] = await db.execute(
        `UPDATE notifications SET receiver_id = ?, receiver_type = ?, message = ? where id = ?`,
        [
            data.receiver_id,
            data.receiver_type,
            data.message,
            data.id
        ]
    );
    return rows;
};

exports.check_Notification_exists = async (id) => {
    const [rows] = await db.execute(
        `SELECT id from notifications WHERE id = ?`,
        [
            id
        ]
    );
    return rows[0];
};

exports.delete_Notification_By_Id = async (id) => {
    const [rows] = await db.execute(
        `DELETE FROM notifications WHERE id = ?`,
        [
            id
        ]
    );
    return rows;
};
