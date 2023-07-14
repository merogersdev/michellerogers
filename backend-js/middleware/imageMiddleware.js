const Multer = require('multer');

// Use memory and limit uploads to 5MB
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { multer };