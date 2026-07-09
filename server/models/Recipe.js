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
  origin: {
    type: String,
    required: [true, 'Please add the country of origin']
  },
  ingredients: [String],
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
