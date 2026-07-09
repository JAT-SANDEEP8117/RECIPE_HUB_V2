const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getMyRecipes,
  getAdminRecipes,
  createRecipe, 
  reviewRecipe,
  deleteRecipe,
  getContributorsStats
} = require('../controllers/recipeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Public route to get only approved recipes
router.get('/', getRecipes);

// Cook routes
router.get('/my-recipes', protect, authorize('cook', 'admin'), getMyRecipes);
router.post('/', protect, authorize('cook', 'admin'), upload.single('image'), createRecipe);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAdminRecipes);
router.get('/admin/contributors', protect, authorize('admin'), getContributorsStats);
router.patch('/:id/review', protect, authorize('admin'), reviewRecipe);

// Delete route
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
