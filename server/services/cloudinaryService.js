const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload an image file to Cloudinary.
 * @param {string} filePath - Local temp file path.
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'recipehub'
    });
    // Delete local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    // Make sure to clean up file even on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary.
 * @param {string} publicId - The Cloudinary public ID.
 * @returns {Promise<any>}
 */
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage
};
