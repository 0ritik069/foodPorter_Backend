const Order = require('../models/order.model');

exports.placeOrder = async (req, res) => {
  try {
    const { restaurant_id, items, total_price, payment_method } = req.body;
    const customer_id = req.user.id;

    const orderId = await Order.create({ customer_id, restaurant_id, total_price, payment_method });

    for (let item of items) {
      await Order.addItem({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      });
    }

    res.status(201).json({ message: 'Order placed', order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const orders = await Order.getCustomerOrders(customer_id);

    for (let order of orders) {
      order.items = await Order.getOrderItems(order.id);
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
