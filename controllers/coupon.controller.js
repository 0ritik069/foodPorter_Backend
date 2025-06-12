const Coupon = require('../models/coupons.model');

exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, orderTotal } = req.body;

    if (!couponCode || !orderTotal) {
      return res.status(400).json({ success: false, message: 'Coupon code and order total required' });
    }

    const coupon = await Coupon.findByCode(couponCode.toUpperCase());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    const today = new Date();
    const expiry = new Date(coupon.expiry_date);

    if (expiry < today) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (orderTotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount should be ₹${coupon.min_order_amount}`
      });
    }

    // Calculate discount
    let discount = (coupon.discount_percent / 100) * orderTotal;
    if (discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      discount,
      finalAmount: orderTotal - discount
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
