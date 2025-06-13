// controllers/cart.controller.js
const pool = require('../config/db');
const Cart = require('../models/cart.model');

const BASE_URL = 'http://192.168.1.80:5000';
const DISH_IMG_PATH = BASE_URL + '/uploads/dishes/';



const fetchCoupon = async (code) => {
  const [rows] = await pool.query(
    'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expiry_date > NOW()',
    [code]
  );
  return rows[0] || null;
};

const calcDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;

  if (subtotal < coupon.min_order_value) return 0;

  if (coupon.discount_type === 'flat') return coupon.discount_value;

  // percentage
  let disc = (subtotal * coupon.discount_value) / 100;
  if (coupon.max_discount && disc > coupon.max_discount) disc = coupon.max_discount;
  return Math.round(disc);
};


exports.addToCart = async (req, res) => {
  try {
    await Cart.addOrUpdate(req.user.id, req.body.dish_id);
    res.json({ success: true, message: 'Dish added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const couponCode = req.query.coupon?.trim().toUpperCase() || null;

    /* 1. items + subtotal */
    const items = await Cart.getUserCart(userId);
    if (!items.length) {
      return res.json({
        success: true,
        message: 'Cart is empty',
        data: { cartItems: [], subtotal: 0, total: 0 }
      });
    }

    let subtotal = 0;
    const cartItems = items.map((i) => {
      const total = i.price * i.quantity;
      subtotal += total;
      return {
        dish_id: i.dish_id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total,
        image: i.image ? DISH_IMG_PATH + i.image : null
      };
    });

   
    let discount = 0, couponInfo = null;
    if (couponCode) {
      const coupon = await fetchCoupon(couponCode);
      discount = calcDiscount(coupon, subtotal);
      if (coupon) {
        couponInfo = { code: coupon.code, discount };
      }
    }

  
    const deliveryCharge = subtotal >= 499 ? 0 : 30;

 
    const total = subtotal - discount + deliveryCharge;

    res.json({
      success: true,
      message: 'Cart details',
      data: {
        cartItems,
        subtotal,
        discount,
        delivery_charge: deliveryCharge,
        total,
        coupon: couponInfo,
        you_saved: discount
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
