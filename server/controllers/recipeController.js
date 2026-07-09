const Recipe = require('../models/Recipe');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { sendRecipeReviewNotification, sendNewRecipeNewsletterEmail } = require('../services/emailService');

// @desc    Get approved recipes (public)
// @route   GET /api/recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'approved' }).populate('user', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user/cook submitted recipes
// @route   GET /api/recipes/my-recipes
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).populate('user', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all recipes for admin dashboard
// @route   GET /api/recipes/admin/all
const getAdminRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'name email');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
const createRecipe = async (req, res) => {
  let uploadedPublicId = null;
  try {
    const { name, category, recipeType, origin, ingredients, procedure, prepTime, difficulty, servings } = req.body;
    
    if (!name || !category || !recipeType || !origin) {
      return res.status(400).json({ message: 'Please add all required fields: name, category, recipeType, origin' });
    }

    // Ingredients and procedure come as JSON strings from FormData, need to parse them
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedProcedure = typeof procedure === 'string' ? JSON.parse(procedure) : procedure;

    let imageUrl = '';
    
    // Cloudinary Upload
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.path);
        imageUrl = uploadResult.secure_url;
        uploadedPublicId = uploadResult.public_id;
      } catch (err) {
        return res.status(500).json({ message: `Image upload failed: ${err.message}` });
      }
    }

    const recipe = new Recipe({
      user: req.user.id,
      name,
      category, // In the schema, Veg/Non-Veg is stored in 'category'
      recipeType,
      origin,
      prepTime: prepTime || '25 min',
      difficulty: difficulty || 'Easy',
      servings: servings || '2-3 People',
      ingredients: parsedIngredients || [],
      procedure: parsedProcedure || [],
      image: imageUrl,
      cloudinaryPublicId: uploadedPublicId,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      submitterRole: req.user.role
    });

    const createdRecipe = await recipe.save();

    // Nodemailer Alert to Admin
    let emailStatus = 'sent';
    try {
      await sendRecipeReviewNotification(createdRecipe, req.user.name, req.user.email);
    } catch (emailErr) {
      console.error(`Graceful SMTP Fallback: Failed to send admin notification for recipe ${createdRecipe.name}:`, emailErr.message);
      emailStatus = 'failed_but_saved';
    }

    res.status(201).json({
      recipe: createdRecipe,
      emailStatus
    });
  } catch (error) {
    console.error(error);
    // Cleanup Cloudinary file if DB transaction failed
    if (uploadedPublicId) {
      try {
        await deleteImage(uploadedPublicId);
        console.log(`Cleaned up orphaned Cloudinary image: ${uploadedPublicId}`);
      } catch (cleanupErr) {
        console.error(`Failed to clean up Cloudinary image ${uploadedPublicId}:`, cleanupErr.message);
      }
    }
    res.status(400).json({ message: 'Invalid recipe data or saving failed' });
  }
};

// @desc    Approve/Reject recipe (Admin)
// @route   PATCH /api/recipes/:id/review
const reviewRecipe = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status value' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const oldStatus = recipe.status;
    recipe.status = status;
    if (status === 'rejected') {
      recipe.rejectionReason = reason || 'No reason provided';
    } else {
      recipe.rejectionReason = undefined;
    }

    await recipe.save();

    // If recipe is approved and was not approved before, notify newsletter subscribers asynchronously
    if (status === 'approved' && oldStatus !== 'approved') {
      (async () => {
        try {
          const Subscriber = require('../models/Subscriber');
          const subscribers = await Subscriber.find({});
          if (subscribers.length > 0) {
            const emails = subscribers.map(s => s.email);
            console.log(`Sending new recipe alert to ${emails.length} subscribers...`);
            await sendNewRecipeNewsletterEmail(recipe, emails);
          }
        } catch (err) {
          console.error('Error sending newsletter updates on recipe approval:', err.message);
        }
      })();
    }

    res.json({ message: `Recipe successfully ${status}`, recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check for authorization: owner or admin
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete associated image from Cloudinary
    if (recipe.cloudinaryPublicId) {
      try {
        await deleteImage(recipe.cloudinaryPublicId);
        console.log(`Deleted Cloudinary asset for recipe: ${recipe.cloudinaryPublicId}`);
      } catch (cloudinaryErr) {
        console.error(`Failed to delete Cloudinary asset ${recipe.cloudinaryPublicId}:`, cloudinaryErr.message);
      }
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get cooks/contributors statistics (Admin only)
// @route   GET /api/recipes/admin/contributors
const getContributorsStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const stats = await User.aggregate([
      {
        $match: {
          role: { $in: ['cook', 'admin'] }
        }
      },
      {
        $lookup: {
          from: "recipes",
          localField: "_id",
          foreignField: "user",
          as: "userRecipes"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          recipeCount: { $size: "$userRecipes" },
          latestRecipeDate: {
            $cond: {
              if: { $gt: [{ $size: "$userRecipes" }, 0] },
              then: { $max: "$userRecipes.createdAt" },
              else: null
            }
          }
        }
      },
      {
        $sort: { recipeCount: -1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching contributor stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getRecipes,
  getMyRecipes,
  getAdminRecipes,
  createRecipe,
  reviewRecipe,
  deleteRecipe,
  getContributorsStats
};
