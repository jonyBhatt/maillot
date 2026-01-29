const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Cloudinary will automatically pick up CLOUDINARY_URL from the environment
cloudinary.config({
    secure: true
});

module.exports = cloudinary;
