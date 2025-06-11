const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others'; // default

    if (req.baseUrl.includes('restaurants')) {
      folder = 'uploads/restaurants';
    } else if (req.baseUrl.includes('drivers')) {
      folder = 'uploads/drivers';
    } else if (req.baseUrl.includes('categories')) {
      folder = 'uploads/categories';
    } else if (req.baseUrl.includes('dishes')) {
      folder = 'uploads/dishes';
    } else if (req.baseUrl.includes('filters')) {
      folder = 'uploads/filters';
    }

    // Ensure folder exists
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, WEBP allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
