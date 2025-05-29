const Product = require('../models/product.model');


exports.createProduct = async (req, res) => {
  try {
    const restaurant_id = req.user.id; // from JWT
    // const category_id=3;
    const { name, description, price, image,category_id } = req.body;

    const id = await Product.create({
      name,
      description,
      price,
      image,
      category_id,
      restaurant_id,
    });
    console.log(category_id);

    res.status(201).json({ success: true, message: 'Product created', product_id: id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all products of a restaurant
exports.getAllProducts = async (req, res) => {
  try {
    const restaurant_id = req.user.id; // from token
    const products = await Product.findAll(restaurant_id);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ success: false, message:'Product not found' });
        }
        res.status(200).json({success: true, data: product });
        }
        catch (error) {
            res.status(500).json({ success:false, message: 'Server error', error: error.message });
        }

    }


// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    await Product.update(productId, updateData);

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.delete(productId);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
