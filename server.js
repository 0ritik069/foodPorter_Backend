const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const initModels = require('./models/initModels');
const authRoutes = require('./routes/authRoutes');

const protected = require('./routes/protected.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const DishRoutes = require('./routes/dish.routes');
const customerRoutes = require('./routes/customer.route');
const driverRoutes = require('./routes/driver.routers');
const otpRoutes = require('./routes/otpRoutes');
const searchRoutes = require('./routes/search.route');
const couponRoutes = require('./routes/coupon.routes');
const path = require('path');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initModels();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/protected', protected);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dishes', DishRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/filters', require('./routes/filter.route'));
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', require('./routes/cart.routes'));

app.get('/', (req, res) => {
    res.send('API IS RUNNING');
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);

});
