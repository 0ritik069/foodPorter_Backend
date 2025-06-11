const BASE_URL = "http://192.168.1.80:5000";
const pool = require('../config/db');


exports.createFilter = async (req, res) => {
  try {
    const { name, type } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      "INSERT INTO filters (name, image, type) VALUES (?, ?, ?)",
      [name, image, type]
    );

    res.status(201).json({
      success: true,
      message: "Filter created successfully",
      data: {
        id: result.insertId,
        name,
        type,
        image: image ? `${BASE_URL}/uploads/filters/${image}` : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating filter",
      error: error.message
    });
  }
};



exports.getAllFilters = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM filters");

    const filters = rows.map(f => ({
      ...f,
      image: f.image ? `${BASE_URL}/uploads/filters/${f.image}` : null
    }));

    res.status(200).json({
      success: true,
      message: "All filters fetched successfully",
      filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching all filters",
      error: error.message
    });
  }
};



exports.getImageFilters = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM filters WHERE image IS NOT NULL");

    const filters = rows.map(f => ({
      ...f,
      image: `${BASE_URL}/uploads/filters/${f.image}`
    }));

    res.status(200).json({
      success: true,
      message: "Image filters fetched successfully",
      filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching image filters",
      error: error.message
    });
  }
};




exports.getTextFilters = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM filters WHERE image IS NULL");

    res.status(200).json({
      success: true,
      message: "Text filters fetched successfully",
      filters: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching text filters",
      error: error.message
    });
  }
};
