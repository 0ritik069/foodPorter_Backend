const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const restaurant_id = req.params.restaurant_id; 

    if (!name) return res.status(400).json({ message: "Name is required" });

    const categoryId = await Category.create({ name, restaurant_id });
    res.status(201).json({ message: "Category created", categoryId });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getCategoriesById = async (req,res)=>{
  try{
    const restaurant_id = 1;
    const category = await Category.findById(restaurant_id);
    res.status(200).json(category);
  }
  catch(err){
    res.status(500).json({message:"Internal server error"});
  }
},

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    await Category.update(categoryId, name);
    res.json({ message: "Category updated" });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.delete(categoryId);
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
