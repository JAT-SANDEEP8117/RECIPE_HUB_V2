const express = require('express');
const router = express.Router();
const { getRecipes, createRecipe, deleteRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/', getRecipes);
router.post('/', protect, upload.single('image'), createRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
