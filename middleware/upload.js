const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.baseUrl.includes('restaurants')) {
      cb(null, 'uploads/restaurants');
    } else if (req.baseUrl.includes('drivers')) {
      cb(null, 'uploads/drivers');
    } else if (req.baseUrl.includes('categories')) {
      cb(null, 'uploads/categories');  // Add this line to save category images here
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
