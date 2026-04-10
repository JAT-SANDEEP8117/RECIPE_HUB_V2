const Recipe = require('../models/Recipe');

// @desc    Get all recipes
// @route   GET /api/recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    const { name, category, origin, ingredients, procedure } = req.body;
    
    // Ingredients and procedure come as JSON strings from FormData, need to parse them
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedProcedure = typeof procedure === 'string' ? JSON.parse(procedure) : procedure;

    const recipe = new Recipe({
      user: req.user.id,
      name,
      category,
      origin,
      ingredients: parsedIngredients,
      procedure: parsedProcedure,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid recipe data' });
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

    // Check for user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getRecipes,
  createRecipe,
  deleteRecipe
};
