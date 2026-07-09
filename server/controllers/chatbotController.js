const Recipe = require('../models/Recipe');
const Groq = require('groq-sdk');

// Initialize Groq client lazily to avoid crash if API key is not yet set
let groq = null;
const getGroqClient = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
    }
    groq = new Groq({ apiKey });
  }
  return groq;
};

// @desc    Chat with Groq AI Recipe Assistant
// @route   POST /api/chatbot
const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Please provide a valid message' });
    }

    if (message.length > 500) {
      return res.status(400).json({ message: 'Message is too long (maximum 500 characters)' });
    }

    // Retrieve all approved recipes
    const approvedRecipes = await Recipe.find({ status: 'approved' });

    // Format simple context for Groq
    const recipeContext = approvedRecipes.map(r => ({
      id: r._id.toString(),
      name: r.name,
      category: r.category,
      origin: r.origin,
      ingredients: r.ingredients
    }));

    const systemPrompt = `You are a helpful and expert AI Culinary Assistant for RecipeHub.
You MUST only recommend recipes that ACTUALLY exist in our database. Do NOT invent new recipes or recommend items that are not in the list below.
Here are the available approved recipes on RecipeHub:
${JSON.stringify(recipeContext)}

Instructions:
1. Recommend one or more recipes from the list above that best match the user's request.
2. If the user asks for something we don't have, politely tell them we don't have it, but suggest the closest alternative(s) from the list above.
3. Reference recipes by their exact names (e.g. "Biryani", "Pizza").
4. Keep your recommendations concise, engaging, and professional.`;

    try {
      const groqClient = getGroqClient();
      const chatCompletion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 800
      });

      const responseText = chatCompletion.choices[0].message.content;

      // Validate recommendations against actual recipes
      const recommendedRecipes = [];
      approvedRecipes.forEach(recipe => {
        const escapedName = recipe.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Match exact word boundary or full string case-insensitive
        const regex = new RegExp(`\\b${escapedName}\\b`, 'i');
        if (regex.test(responseText)) {
          recommendedRecipes.push({
            id: recipe._id,
            name: recipe.name,
            category: recipe.category,
            origin: recipe.origin,
            image: recipe.image,
            procedure: recipe.procedure
          });
        }
      });

      res.json({
        response: responseText,
        recommendedRecipes
      });
    } catch (groqErr) {
      console.error('Groq API Error:', groqErr.message);
      res.status(502).json({
        message: 'Groq AI Service is currently unavailable. Please try again later.',
        fallback: 'I am sorry, but I am having trouble connecting to the kitchen AI at the moment.'
      });
    }
  } catch (error) {
    console.error('Chatbot Controller Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  chatWithAssistant
};
