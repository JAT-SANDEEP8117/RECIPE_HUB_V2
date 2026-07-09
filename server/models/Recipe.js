const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a recipe name']
  },
  category: {
    type: String,
    enum: ['Veg', 'Non-Veg'],
    required: true
  },
  recipeType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
    required: [true, 'Please add a recipe type']
  },
  origin: {
    type: String,
    required: [true, 'Please add the country of origin']
  },
  prepTime: {
    type: String,
    default: '25 min'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  servings: {
    type: String,
    default: '2-3 People'
  },
  ingredients: [
    {
      name: {
        type: String,
        required: [true, 'Please add an ingredient name']
      },
      quantity: {
        type: String,
        required: [true, 'Please add the required quantity']
      }
    }
  ],
  procedure: [String],
  image: {
    type: String
  },
  cloudinaryPublicId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  submitterRole: {
    type: String,
    enum: ['user', 'cook', 'admin'],
    default: 'cook'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
