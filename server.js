const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const initModels = require('./models/initModels');
const authRoutes = require('./routes/authRoutes');

const protected = require('./routes/protected.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const ProductRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.route');
const driverRoutes = require('./routes/driver.routers');
const otpRoutes = require('./routes/otpRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initModels();

app.use('/uploads', express.static('uploads'));



app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/protected', protected);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/driver', driverRoutes);

app.get('/', (req, res) => {
    res.send('API IS RUNNING');
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);

});
