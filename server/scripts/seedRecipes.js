const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { uploadImage } = require('../services/cloudinaryService');

const seedRecipes = async () => {
  try {
    await connectDB();

    // Find admin user to associate recipes with
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run "npm run seed:admin" first.');
      process.exit(1);
    }

    // Clear existing recipes to allow clean re-seed
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes from database.');

    const recipesFilePath = path.join(__dirname, 'recipes.json');
    if (!fs.existsSync(recipesFilePath)) {
      console.error('recipes.json file not found in scripts folder.');
      process.exit(1);
    }

    const staticRecipes = JSON.parse(fs.readFileSync(recipesFilePath, 'utf8'));
    console.log(`Found ${staticRecipes.length} static recipes to migrate.`);

    for (let index = 0; index < staticRecipes.length; index++) {
      const recData = staticRecipes[index];
      console.log(`Processing [${index + 1}/${staticRecipes.length}]: ${recData.name}...`);

      // Idempotency check: see if recipe name already exists
      const existingRecipe = await Recipe.findOne({ name: recData.name });
      if (existingRecipe) {
        console.log(`--> Recipe "${recData.name}" already exists in database. Skipping.`);
        continue;
      }

      let imageUrl = '';
      let cloudinaryPublicId = '';

      // Determine local image path
      const imgFileName = path.basename(recData.image);
      const localImgPath = path.join(__dirname, '..', '..', 'client', 'public', 'images', imgFileName);
      
      if (fs.existsSync(localImgPath)) {
        console.log(`--> Local image found: ${imgFileName}. Preparing to upload to Cloudinary...`);
        
        // Ensure server/uploads directory exists for temp operations
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Copy original file to temp to prevent cloudinaryService from deleting original asset
        const tempPath = path.join(uploadsDir, `temp_seed_${Date.now()}_${imgFileName}`);
        fs.copyFileSync(localImgPath, tempPath);

        try {
          const uploadResult = await uploadImage(tempPath);
          imageUrl = uploadResult.secure_url;
          cloudinaryPublicId = uploadResult.public_id;
          console.log(`--> Cloudinary upload successful: ${imageUrl}`);
        } catch (uploadErr) {
          console.error(`--> Image upload failed for ${recData.name}: ${uploadErr.message}. Using fallback.`);
          imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop';
        }
      } else {
        console.log(`--> Local image file not found at ${localImgPath}. Using fallback unsplash image.`);
        imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop';
      }

      const recipeDoc = new Recipe({
        user: admin._id,
        name: recData.name,
        category: recData.category,
        origin: recData.origin,
        ingredients: [], // Original static data doesn't have separate ingredients list
        procedure: recData.procedure,
        image: imageUrl,
        cloudinaryPublicId: cloudinaryPublicId || undefined,
        status: 'approved',
        submitterRole: 'admin'
      });

      await recipeDoc.save();
      console.log(`--> Saved recipe "${recData.name}" to MongoDB.`);
    }

    await mongoose.connection.close();
    console.log('Recipe seeding/migration completed. Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error migrating recipes: ${error.message}`);
    process.exit(1);
  }
};

seedRecipes();
