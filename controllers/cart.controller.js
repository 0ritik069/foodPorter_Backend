const Cart = require('../models/cart.model');

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { dish_id } = req.body;

    await Cart.addOrUpdate(user_id, dish_id);

    res.status(200).json({
      success: true,
      message: 'Dish added to cart'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const items = await Cart.getUserCart(user_id);
    let total = 0;

    const formatted = items.map(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      return {
        dish_id: item.dish_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
        image: item.image ? `http://192.168.1.80:5000/uploads/dishes/${item.image}` : null
      };
    });

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      cartItems: formatted,
      subtotal: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
