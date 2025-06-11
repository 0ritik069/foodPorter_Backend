const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');
const uploadFilter = require('../middleware/upload');

// ✅ Create filter (image optional)
router.post('/', uploadFilter.single('image'), filterController.createFilter);

// ✅ Get image filters (with image)
router.get('/image-list', filterController.getImageFilters);

// ✅ Get text filters (without image)
router.get('/text-list', filterController.getTextFilters);

module.exports = router;
