const Order = require('../models/order.model');


exports.placeOrder = async (req, res) => {
  try {
    const { restaurant_id, items, total_price, payment_method } = req.body;
    const customer_id = req.user.id;

    if (!restaurant_id || !Array.isArray(items) || items.length === 0 || !total_price || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: restaurant_id, items, total_price, payment_method',
      });
    }

    
    const orderId = await Order.create({
      customer_id,
      restaurant_id,
      total_price,
      payment_method,
    });

        for (let item of items) {
      await Order.addItem({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order_id: orderId,
      },
    });
  } catch (error) {
    console.error('Place Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const orders = await Order.getCustomerOrders(customer_id);

    for (let order of orders) {
      order.items = await Order.getOrderItems(order.id);
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
