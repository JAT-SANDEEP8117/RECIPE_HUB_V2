const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const updatedRecipesData = {
  "Biryani": {
    recipeType: "Dinner",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "4 People",
    ingredients: [
      { name: "Chicken or Mutton", quantity: "500 g" },
      { name: "Basmati Rice", quantity: "2 cups" },
      { name: "Yogurt", quantity: "1 cup" },
      { name: "Onions (sliced)", quantity: "2 large" },
      { name: "Ginger-Garlic Paste", quantity: "2 tbsp" },
      { name: "Biryani Masala", quantity: "3 tbsp" },
      { name: "Mint & Coriander Leaves", quantity: "1/2 cup" },
      { name: "Saffron dissolved in warm milk", quantity: "a pinch" },
      { name: "Ghee or Oil", quantity: "4 tbsp" }
    ],
    procedure: [
      "Step 1: Marinate 500g meat with yogurt, ginger-garlic paste, biryani spices, and a pinch of salt for 1 to 2 hours.",
      "Step 2: Wash and soak basmati rice for 30 minutes, then cook in boiling salted water with whole spices until 70% done.",
      "Step 3: Sauté sliced onions in ghee until deep brown and caramelized (birista). Set half aside for layering.",
      "Step 4: Add the marinated meat to the pan with sautéed onions, tomatoes, and cook on medium heat until tender.",
      "Step 5: In a heavy-bottomed pot, layer the cooked meat, followed by a layer of parboiled rice, mint, coriander, and fried onions.",
      "Step 6: Drizzle saffron milk and ghee on top. Seal the pot with dough or foil and cook on low heat (dum) for 20-25 minutes.",
      "Step 7: Fluff gently and serve hot with cooling cucumber raita."
    ]
  },
  "Butter Chicken": {
    recipeType: "Dinner",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: "3 People",
    ingredients: [
      { name: "Chicken Breast or Thighs (cubed)", quantity: "500 g" },
      { name: "Butter", quantity: "50 g" },
      { name: "Tomato Puree", quantity: "1 cup" },
      { name: "Heavy Cream", quantity: "1/2 cup" },
      { name: "Ginger-Garlic Paste", quantity: "1 tbsp" },
      { name: "Garam Masala", quantity: "1 tsp" },
      { name: "Kashmiri Red Chili Powder", quantity: "1.5 tsp" },
      { name: "Cashews (soaked and blended)", quantity: "2 tbsp" },
      { name: "Yogurt (for marinade)", quantity: "3 tbsp" }
    ],
    procedure: [
      "Step 1: Marinate the chicken cubes with yogurt, ginger-garlic paste, red chili powder, garam masala, and salt. Grill or pan-fry until charred and cooked through.",
      "Step 2: Sauté onions, garlic, and ginger in a pan, then add tomato puree and soaked cashews. Simmer for 10 minutes and blend to a smooth puree.",
      "Step 3: Melt butter in a clean pan, pour the blended gravy base, and bring to a simmer. Add garam masala, chili powder, and salt.",
      "Step 4: Stir in the cooked chicken and simmer for 5-7 minutes until the flavors meld.",
      "Step 5: Reduce heat, stir in heavy cream, garnish with a swirl of cream and fresh coriander, and serve with hot butter naan."
    ]
  },
  "Paneer Tikka": {
    recipeType: "Snack",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "3 People",
    ingredients: [
      { name: "Paneer (cubed)", quantity: "250 g" },
      { name: "Bell Peppers (colored, cubed)", quantity: "1 large" },
      { name: "Onion (petals)", quantity: "1 medium" },
      { name: "Thick Yogurt (hung curd)", quantity: "1/2 cup" },
      { name: "Tikka Masala Powder", quantity: "2 tbsp" },
      { name: "Ginger-Garlic Paste", quantity: "1 tsp" },
      { name: "Lemon Juice", quantity: "1 tbsp" },
      { name: "Kasoori Methi", quantity: "1 tsp" },
      { name: "Mustard Oil", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Whisk hung curd, ginger-garlic paste, tikka masala, lemon juice, kasoori methi, mustard oil, and salt in a bowl to make the marinade.",
      "Step 2: Add paneer cubes, onion petals, and bell pepper cubes. Mix gently to coat and let marinate for at least 30 minutes.",
      "Step 3: Thread the marinated paneer and veggies alternately onto skewers.",
      "Step 4: Preheat oven to 200°C (390°F) or heat a grill pan. Grill the skewers for 10-15 minutes, turning occasionally.",
      "Step 5: Baste with melted butter midway through grilling for extra richness.",
      "Step 6: Sprinkle with chaat masala and serve with spicy mint chutney."
    ]
  },
  "Masala Dosa": {
    recipeType: "Breakfast",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "4 People",
    ingredients: [
      { name: "Fermented Dosa Batter", quantity: "3 cups" },
      { name: "Potatoes (boiled and mashed)", quantity: "3 medium" },
      { name: "Mustard Seeds", quantity: "1 tsp" },
      { name: "Turmeric Powder", quantity: "1/2 tsp" },
      { name: "Curry Leaves", quantity: "10 leaves" },
      { name: "Green Chilies (chopped)", quantity: "2 pieces" },
      { name: "Onions (sliced)", quantity: "1 large" },
      { name: "Oil or Ghee", quantity: "as needed" }
    ],
    procedure: [
      "Step 1: Prepare potato filling by heating oil, spluttering mustard seeds, green chilies, curry leaves, and sliced onions until translucent.",
      "Step 2: Add turmeric powder, salt, and boiled mashed potatoes. Stir well, splash a bit of water, and cook for 5 minutes.",
      "Step 3: Heat a non-stick tawa/griddle. Ladle batter onto the center and spread in a circular motion to make a thin crepe.",
      "Step 4: Drizzle oil or ghee around the edges and cook on medium heat until the bottom turns golden brown and crispy.",
      "Step 5: Place a portion of potato filling in the center, fold the dosa over it, and transfer to a plate.",
      "Step 6: Serve immediately with coconut chutney and piping hot sambar."
    ]
  },
  "Dal Makhani": {
    recipeType: "Dinner",
    prepTime: "40 min",
    difficulty: "Medium",
    servings: "4 People",
    ingredients: [
      { name: "Whole Black Lentils (Urad Dal)", quantity: "1 cup" },
      { name: "Kidney Beans (Rajma)", quantity: "1/4 cup" },
      { name: "Butter", quantity: "4 tbsp" },
      { name: "Heavy Cream", quantity: "3 tbsp" },
      { name: "Tomato Puree", quantity: "1/2 cup" },
      { name: "Ginger-Garlic Paste", quantity: "1 tbsp" },
      { name: "Kasoori Methi", quantity: "1 tsp" },
      { name: "Red Chili Powder", quantity: "1 tsp" }
    ],
    procedure: [
      "Step 1: Soak black lentils and kidney beans overnight. Pressure cook with salt and water until soft.",
      "Step 2: Heat butter in a pan, sauté ginger-garlic paste, then cook tomato puree with chili powder until oil separates.",
      "Step 3: Pour in the cooked dal and rajma along with cooking liquid. Mash some lentils against the side of the pot to thicken.",
      "Step 4: Simmer on low heat for 30 minutes, stirring occasionally, to achieve a creamy consistency.",
      "Step 5: Stir in kasoori methi, remaining butter, and heavy cream. Simmer for 5 more minutes and serve hot."
    ]
  },
  "Pizza": {
    recipeType: "Lunch",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "2 People",
    ingredients: [
      { name: "Pizza Dough", quantity: "1 ball" },
      { name: "Pizza Sauce", quantity: "1/2 cup" },
      { name: "Mozzarella Cheese (shredded)", quantity: "1.5 cups" },
      { name: "Cherry Tomatoes (halved)", quantity: "1/2 cup" },
      { name: "Fresh Basil Leaves", quantity: "a few" },
      { name: "Olive Oil", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Preheat oven to 220°C (430°F) or highest setting. Roll out the pizza dough on a floured surface to your desired thickness.",
      "Step 2: Transfer the dough to a baking tray or pizza stone. Spread pizza sauce evenly, leaving a thin border.",
      "Step 3: Scatter shredded mozzarella cheese and halved cherry tomatoes over the sauce.",
      "Step 4: Bake in the preheated oven for 12-15 minutes until the crust is golden and cheese is bubbly and slightly browned.",
      "Step 5: Remove from oven, top with fresh basil leaves, drizzle with olive oil, slice, and serve hot."
    ]
  },
  "Pasta": {
    recipeType: "Lunch",
    prepTime: "15 min",
    difficulty: "Easy",
    servings: "2 People",
    ingredients: [
      { name: "Penne Pasta", quantity: "200 g" },
      { name: "Marinara Tomato Sauce", quantity: "1 cup" },
      { name: "Garlic (minced)", quantity: "3 cloves" },
      { name: "Olive Oil", quantity: "2 tbsp" },
      { name: "Parmesan Cheese", quantity: "1/4 cup" },
      { name: "Fresh Basil", quantity: "4 leaves" }
    ],
    procedure: [
      "Step 1: Boil water in a large pot with salt, add penne pasta, and cook until al dente (approx 9-11 minutes). Drain, keeping some pasta water.",
      "Step 2: Heat olive oil in a skillet, sauté minced garlic until fragrant but not browned.",
      "Step 3: Pour in marinara sauce and simmer for 5 minutes. Toss in fresh basil.",
      "Step 4: Add cooked pasta to the skillet, along with a splash of pasta water, and toss over medium heat for 2 minutes to coat.",
      "Step 5: Serve hot topped with freshly grated parmesan cheese."
    ]
  },
  "Risotto": {
    recipeType: "Lunch",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "2 People",
    ingredients: [
      { name: "Arborio Rice", quantity: "1 cup" },
      { name: "Vegetable Broth (warm)", quantity: "3 cups" },
      { name: "White Wine (dry)", quantity: "1/4 cup" },
      { name: "Butter", quantity: "2 tbsp" },
      { name: "Parmesan Cheese (grated)", quantity: "1/3 cup" },
      { name: "Onion (finely chopped)", quantity: "1 small" },
      { name: "Olive Oil", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Heat olive oil and 1 tbsp butter in a pot. Sauté chopped onion until soft and translucent.",
      "Step 2: Add Arborio rice, stir to coat in fat, and toast for 2 minutes until edges are translucent.",
      "Step 3: Pour in white wine, stirring constantly until fully absorbed by the rice.",
      "Step 4: Add warm vegetable broth, one ladle at a time, stirring constantly. Wait until the broth is absorbed before adding more.",
      "Step 5: Continue this process for 18-20 minutes until rice is creamy and tender but holds its shape (al dente).",
      "Step 6: Remove from heat, vigorously stir in remaining butter and parmesan cheese. Serve immediately."
    ]
  },
  "Tiramisu": {
    recipeType: "Dessert",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: "6 People",
    ingredients: [
      { name: "Ladyfinger Biscuits", quantity: "24 pieces" },
      { name: "Mascarpone Cheese", quantity: "250 g" },
      { name: "Strong Espresso (cooled)", quantity: "1 cup" },
      { name: "Heavy Whipping Cream", quantity: "1 cup" },
      { name: "Cocoa Powder", quantity: "2 tbsp" },
      { name: "Sugar", quantity: "1/2 cup" },
      { name: "Vanilla Extract", quantity: "1 tsp" }
    ],
    procedure: [
      "Step 1: In a large bowl, whisk mascarpone cheese, sugar, and vanilla extract until smooth.",
      "Step 2: In a separate bowl, whip heavy cream to stiff peaks, then gently fold it into the mascarpone mixture.",
      "Step 3: Dip ladyfinger biscuits quickly into the cooled espresso (do not soak them completely).",
      "Step 4: Arrange a layer of dipped ladyfingers in the bottom of a square dish. Spread half of the mascarpone cream on top.",
      "Step 5: Repeat with another layer of ladyfingers and top with the remaining cream. Cover and chill in the fridge for at least 4 hours.",
      "Step 6: Just before serving, dust the top generously with cocoa powder."
    ]
  },
  "Lasagna": {
    recipeType: "Dinner",
    prepTime: "45 min",
    difficulty: "Medium",
    servings: "6 People",
    ingredients: [
      { name: "Lasagna Sheets", quantity: "12 sheets" },
      { name: "Ground Beef", quantity: "300 g" },
      { name: "Marinara Tomato Sauce", quantity: "2 cups" },
      { name: "Ricotta Cheese", quantity: "1 cup" },
      { name: "Mozzarella (shredded)", quantity: "1 cup" },
      { name: "Parmesan Cheese", quantity: "1/2 cup" },
      { name: "Egg", quantity: "1 piece" }
    ],
    procedure: [
      "Step 1: In a pan, cook ground beef until browned. Add marinara sauce and simmer for 10 minutes to create meat sauce.",
      "Step 2: In a bowl, mix ricotta cheese, egg, half of the parmesan, and a pinch of salt.",
      "Step 3: Boil lasagna sheets until just pliable, then drain.",
      "Step 4: Layer lasagna: spread meat sauce on the bottom of a baking dish, place lasagna sheets, spread ricotta mixture, and sprinkle mozzarella.",
      "Step 5: Repeat layering, finishing with a layer of meat sauce, mozzarella, and remaining parmesan.",
      "Step 6: Bake covered at 180°C (350°F) for 25 minutes, then uncover and bake for another 15 minutes until bubbly and golden."
    ]
  },
  "Borscht": {
    recipeType: "Lunch",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "4 People",
    ingredients: [
      { name: "Beets (peeled and grated)", quantity: "2 medium" },
      { name: "Potatoes (cubed)", quantity: "2 medium" },
      { name: "Cabbage (shredded)", quantity: "1 cup" },
      { name: "Carrots (grated)", quantity: "1 medium" },
      { name: "Onion (chopped)", quantity: "1 medium" },
      { name: "Beef Broth", quantity: "4 cups" },
      { name: "Vinegar", quantity: "1 tbsp" },
      { name: "Sour Cream (for serving)", quantity: "3 tbsp" },
      { name: "Dill (chopped)", quantity: "2 tbsp" }
    ],
    procedure: [
      "Step 1: Sauté chopped onion and grated carrots in oil. Add beets, vinegar, and a splash of broth. Simmer for 10 minutes.",
      "Step 2: Bring the remaining beef broth to a boil in a large pot. Add cubed potatoes and cook for 10 minutes.",
      "Step 3: Stir in the shredded cabbage and the beet-carrot-onion mixture into the pot. Season with salt and pepper.",
      "Step 4: Simmer on low heat for 15 minutes until all vegetables are completely tender.",
      "Step 5: Serve hot in bowls, garnished with a dollop of sour cream and chopped fresh dill."
    ]
  },
  "Beef Stroganoff": {
    recipeType: "Dinner",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: "3 People",
    ingredients: [
      { name: "Beef Sirloin (cut into strips)", quantity: "400 g" },
      { name: "Mushrooms (sliced)", quantity: "1 cup" },
      { name: "Sour Cream", quantity: "1/2 cup" },
      { name: "Beef Broth", quantity: "1/2 cup" },
      { name: "Egg Noodles", quantity: "250 g" },
      { name: "Butter", quantity: "2 tbsp" },
      { name: "Onion (chopped)", quantity: "1 medium" },
      { name: "Flour", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Melt butter in a skillet. Sear beef strips quickly on high heat to brown them. Remove and set aside.",
      "Step 2: Sauté onions and mushrooms in the same skillet until soft. Sprinkle with flour and cook for 1 minute.",
      "Step 3: Pour in beef broth, scraping the bottom of the pan, and bring to a simmer to thicken.",
      "Step 4: Reduce heat, stir in sour cream, and add the beef strips back to warm through (do not boil).",
      "Step 5: Cook egg noodles in boiling salted water, drain, and serve beef stroganoff hot over the noodles."
    ]
  },
  "Pelmeni": {
    recipeType: "Breakfast",
    prepTime: "35 min",
    difficulty: "Hard",
    servings: "4 People",
    ingredients: [
      { name: "Ground Pork & Beef", quantity: "300 g" },
      { name: "All-Purpose Flour", quantity: "2 cups" },
      { name: "Onion (pureed)", quantity: "1 medium" },
      { name: "Egg", quantity: "1 piece" },
      { name: "Butter", quantity: "2 tbsp" },
      { name: "Water (for dough)", quantity: "1/2 cup" },
      { name: "Sour Cream (for serving)", quantity: "as needed" }
    ],
    procedure: [
      "Step 1: Mix flour, egg, water, and salt. Knead into a smooth, firm dough. Wrap and let rest for 30 minutes.",
      "Step 2: Prepare filling by mixing ground meat, pureed onion, salt, and black pepper.",
      "Step 3: Roll the dough out very thin. Cut into small rounds using a glass edge.",
      "Step 4: Place a small spoon of meat filling in the center of each round, fold in half, and pinch edges to seal securely.",
      "Step 5: Boil pelmeni in salted water with a bay leaf for 5-7 minutes after they float to the surface.",
      "Step 6: Drain and toss with melted butter. Serve with sour cream."
    ]
  },
  "Olivier Salad": {
    recipeType: "Lunch",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "4 People",
    ingredients: [
      { name: "Potatoes (boiled and diced)", quantity: "2 medium" },
      { name: "Carrots (boiled and diced)", quantity: "1 medium" },
      { name: "Eggs (boiled and diced)", quantity: "2 pieces" },
      { name: "Canned Green Peas", quantity: "1/2 cup" },
      { name: "Mayonnaise", quantity: "1/2 cup" },
      { name: "Pickles (diced)", quantity: "2 medium" },
      { name: "Dill (chopped)", quantity: "for garnish" }
    ],
    procedure: [
      "Step 1: Ensure all boiled ingredients (potatoes, carrots, eggs) are completely cooled.",
      "Step 2: Dice potatoes, carrots, eggs, and pickles into uniform small cubes.",
      "Step 3: Combine diced vegetables, eggs, and drained green peas in a large mixing bowl.",
      "Step 4: Add mayonnaise, salt, and pepper, and stir gently to combine.",
      "Step 5: Cover and chill in the refrigerator for at least 1 hour before serving. Garnish with dill."
    ]
  },
  "Blini": {
    recipeType: "Snack",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "4 People",
    ingredients: [
      { name: "All-Purpose Flour", quantity: "1 cup" },
      { name: "Milk", quantity: "1.5 cups" },
      { name: "Eggs", quantity: "2 pieces" },
      { name: "Butter (melted)", quantity: "2 tbsp" },
      { name: "Sugar", quantity: "1 tbsp" },
      { name: "Salt", quantity: "1/2 tsp" }
    ],
    procedure: [
      "Step 1: Whisk eggs, sugar, and salt. Alternately add flour and milk to prevent lumps, whisking to a very thin batter.",
      "Step 2: Stir in melted butter and let batter rest for 15 minutes.",
      "Step 3: Heat a lightly oiled crêpe pan or skillet on medium-high heat. Pour a ladle of batter, tilting the pan to coat.",
      "Step 4: Cook for 1-2 minutes until edges are golden and lift, then flip and cook the other side for 30 seconds.",
      "Step 5: Stack blinis on a plate, brushing each with melted butter. Serve warm with jam or sour cream."
    ]
  },
  "Fried Rice": {
    recipeType: "Lunch",
    prepTime: "15 min",
    difficulty: "Easy",
    servings: "2 People",
    ingredients: [
      { name: "Jasmine Rice (cooked, cold)", quantity: "2 cups" },
      { name: "Mixed Veggies (peas, carrots)", quantity: "1/2 cup" },
      { name: "Eggs (beaten)", quantity: "2 pieces" },
      { name: "Soy Sauce", quantity: "2 tbsp" },
      { name: "Sesame Oil", quantity: "1 tsp" },
      { name: "Green Onions (chopped)", quantity: "3 stalks" },
      { name: "Garlic (minced)", quantity: "2 cloves" }
    ],
    procedure: [
      "Step 1: Heat sesame oil in a wok or large skillet. Scramble the beaten eggs quickly, break into pieces, and set aside.",
      "Step 2: Add a bit more oil to the wok, sauté minced garlic and mixed vegetables for 2-3 minutes.",
      "Step 3: Add the cold cooked rice, using a spatula to break up any clumps. Stir-fry on high heat.",
      "Step 4: Drizzle soy sauce over the rice, toss continuously to distribute color and flavor evenly.",
      "Step 5: Fold in the scrambled eggs and chopped green onions. Cook for another minute and serve hot."
    ]
  },
  "Dumplings": {
    recipeType: "Snack",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "3 People",
    ingredients: [
      { name: "Dumpling Wrappers", quantity: "20 sheets" },
      { name: "Ground Pork or Firm Tofu", quantity: "200 g" },
      { name: "Napa Cabbage (shredded)", quantity: "1/2 cup" },
      { name: "Soy Sauce", quantity: "1 tbsp" },
      { name: "Ginger (minced)", quantity: "1 tsp" },
      { name: "Sesame Oil", quantity: "1 tsp" },
      { name: "Dipping Sauce (soy + vinegar)", quantity: "2 tbsp" }
    ],
    procedure: [
      "Step 1: Combine ground pork/tofu, shredded cabbage, ginger, soy sauce, and sesame oil in a bowl. Mix thoroughly.",
      "Step 2: Place a wrapper on your palm, add a spoonful of filling in the center.",
      "Step 3: Wet the edges of the wrapper. Fold in half and pleat the edges to seal completely.",
      "Step 4: Heat 1 tbsp oil in a skillet, place dumplings in a single layer, and fry until bottoms are golden (2 minutes).",
      "Step 5: Pour 1/4 cup water into the skillet, immediately cover with a lid, and steam for 6-8 minutes until cooked through.",
      "Step 6: Remove lid, allow remaining moisture to evaporate, and serve with dipping sauce."
    ]
  },
  "Kung Pao Chicken": {
    recipeType: "Dinner",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: "3 People",
    ingredients: [
      { name: "Chicken Breast (cubed)", quantity: "300 g" },
      { name: "Peanuts (roasted)", quantity: "1/4 cup" },
      { name: "Dried Red Chilies", quantity: "8 pieces" },
      { name: "Soy Sauce", quantity: "2 tbsp" },
      { name: "Szechuan Peppercorns", quantity: "1/2 tsp" },
      { name: "Green Bell Pepper (diced)", quantity: "1 medium" },
      { name: "Garlic & Ginger (minced)", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Marinate chicken cubes with 1 tbsp soy sauce and a pinch of cornstarch for 15 minutes.",
      "Step 2: Heat oil in a wok. Sauté dried chilies and Szechuan peppercorns until fragrant and darkened.",
      "Step 3: Add chicken and stir-fry on high heat until cooked through and lightly browned.",
      "Step 4: Stir in minced garlic, ginger, and diced bell pepper. Cook for 2 minutes.",
      "Step 5: Drizzle remaining soy sauce, toss in roasted peanuts, and cook until sauce coats the chicken. Serve hot with rice."
    ]
  },
  "Spring Rolls": {
    recipeType: "Snack",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "4 People",
    ingredients: [
      { name: "Spring Roll Wrappers", quantity: "10 sheets" },
      { name: "Cabbage (shredded)", quantity: "1 cup" },
      { name: "Carrots (shredded)", quantity: "1/2 cup" },
      { name: "Glass Noodles (cooked)", quantity: "50 g" },
      { name: "Soy Sauce", quantity: "1 tbsp" },
      { name: "Egg (for sealing)", quantity: "1 beaten" },
      { name: "Frying Oil", quantity: "as needed" }
    ],
    procedure: [
      "Step 1: Sauté shredded cabbage, carrots, and glass noodles with soy sauce until vegetables are cooked and dry.",
      "Step 2: Place a wrapper diagonally, spoon filling on the corner, roll tightly, fold in the sides, and roll to seal with beaten egg.",
      "Step 3: Heat oil in a deep pan. Deep-fry rolls in batches until golden brown and crispy.",
      "Step 4: Drain on paper towels and serve hot with sweet chili dipping sauce."
    ]
  },
  "Hot & Sour Soup": {
    recipeType: "Lunch",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "3 People",
    ingredients: [
      { name: "Tofu (cubed)", quantity: "150 g" },
      { name: "Mushrooms (sliced)", quantity: "1/4 cup" },
      { name: "Bamboo Shoots", quantity: "1/4 cup" },
      { name: "Chinese Black Vinegar", quantity: "3 tbsp" },
      { name: "White Pepper Powder", quantity: "1 tsp" },
      { name: "Egg (beaten)", quantity: "1 piece" },
      { name: "Vegetable Broth", quantity: "4 cups" },
      { name: "Cornstarch (slurry)", quantity: "2 tbsp" }
    ],
    procedure: [
      "Step 1: Bring vegetable broth to a boil. Add mushrooms, bamboo shoots, and tofu, cooking for 5 minutes.",
      "Step 2: Stir in vinegar, soy sauce, salt, and white pepper powder.",
      "Step 3: Thicken the soup by stirring in the cornstarch slurry.",
      "Step 4: Slowly drizzle the beaten egg into the simmering soup while stirring gently to create egg ribbons.",
      "Step 5: Garnish with green onions and serve warm."
    ]
  },
  "Sushi": {
    recipeType: "Dinner",
    prepTime: "30 min",
    difficulty: "Hard",
    servings: "2 People",
    ingredients: [
      { name: "Sushi Rice (seasoned)", quantity: "1 cup" },
      { name: "Nori Sheets", quantity: "3 sheets" },
      { name: "Fresh Salmon or Tuna", quantity: "150 g" },
      { name: "Cucumber (strips)", quantity: "1/2 stick" },
      { name: "Avocado (sliced)", quantity: "1/2 piece" },
      { name: "Soy Sauce & Wasabi", quantity: "for serving" }
    ],
    procedure: [
      "Step 1: Cook sushi rice and season with rice vinegar, sugar, and salt. Allow to cool to room temperature.",
      "Step 2: Place a nori sheet shiny side down on a bamboo rolling mat.",
      "Step 3: Wet hands and spread seasoned rice evenly over nori, leaving a 1-inch border at the top.",
      "Step 4: Arrange strips of fish, cucumber, and avocado in a line across the center of the rice.",
      "Step 5: Roll the nori tightly using the mat, sealing the edge with a drop of water.",
      "Step 6: Slice the roll into 6-8 pieces with a sharp wet knife. Serve with soy sauce, pickled ginger, and wasabi."
    ]
  },
  "Tacos": {
    recipeType: "Breakfast",
    prepTime: "15 min",
    difficulty: "Easy",
    servings: "3 People",
    ingredients: [
      { name: "Ground Beef or Chicken", quantity: "250 g" },
      { name: "Taco Shells (corn)", quantity: "6 pieces" },
      { name: "Cheddar Cheese (shredded)", quantity: "1/2 cup" },
      { name: "Lettuce (shredded)", quantity: "1/2 cup" },
      { name: "Salsa or Sour Cream", quantity: "1/4 cup" },
      { name: "Taco Seasoning", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Brown ground meat in a skillet. Drain excess fat, stir in taco seasoning and a splash of water, and simmer for 5 minutes.",
      "Step 2: Warm taco shells in the oven at 150°C (300°F) for 5 minutes to make them crispy.",
      "Step 3: Spoon seasoned meat into the bottom of each taco shell.",
      "Step 4: Top with shredded lettuce, Cheddar cheese, salsa, and sour cream. Serve immediately."
    ]
  },
  "Shawarma": {
    recipeType: "Snack",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: "3 People",
    ingredients: [
      { name: "Chicken Breast (thin strips)", quantity: "400 g" },
      { name: "Pita Bread", quantity: "3 pockets" },
      { name: "Yogurt (for marinade)", quantity: "1/4 cup" },
      { name: "Shawarma Spice Mix", quantity: "1 tbsp" },
      { name: "Garlic Paste", quantity: "1 tsp" },
      { name: "Tahini or Garlic Sauce", quantity: "1/4 cup" },
      { name: "Pickles & Tomatoes", quantity: "sliced" }
    ],
    procedure: [
      "Step 1: Marinate chicken strips with yogurt, garlic paste, shawarma spices, and lemon juice for 1 hour.",
      "Step 2: Grill or pan-fry the chicken on high heat until fully cooked and edges are slightly charred.",
      "Step 3: Warm the pita bread.",
      "Step 4: Spread garlic sauce or tahini inside the pita, stuff with grilled chicken, sliced pickles, and tomatoes.",
      "Step 5: Roll up tightly and toast the wrapped shawarma in a pan for 1 minute on each side before serving."
    ]
  },
  "Paella": {
    recipeType: "Dinner",
    prepTime: "35 min",
    difficulty: "Hard",
    servings: "4 People",
    ingredients: [
      { name: "Arborio or Bomba Rice", quantity: "1.5 cups" },
      { name: "Shrimp & Mussels", quantity: "200 g" },
      { name: "Chicken Thighs (diced)", quantity: "150 g" },
      { name: "Saffron Threads", quantity: "a pinch" },
      { name: "Chicken Broth", quantity: "3 cups" },
      { name: "Onion & Garlic (minced)", quantity: "1/2 cup" },
      { name: "Green Peas & Red Peppers", quantity: "1/2 cup" }
    ],
    procedure: [
      "Step 1: Heat olive oil in a wide paella pan. Sear chicken and shrimp until cooked; set shrimp aside.",
      "Step 2: In the same pan, sauté chopped onion, garlic, and red peppers. Stir in the rice and cook for 2 minutes to toast.",
      "Step 3: Dissolve saffron in hot chicken broth, then pour into the pan. Bring to a boil and cook on medium-high for 10 minutes without stirring.",
      "Step 4: Reduce heat, nestle mussels and cooked shrimp into the rice, and scatter peas on top. Cook for another 8-10 minutes until rice is tender.",
      "Step 5: Let cook on low to form a caramelized rice crust (socarrat) on the bottom. Rest for 5 minutes, garnish with lemon wedges, and serve."
    ]
  },
  "Poutine": {
    recipeType: "Snack",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "2 People",
    ingredients: [
      { name: "Russet Potatoes (cut into wedges)", quantity: "3 large" },
      { name: "Cheese Curds", quantity: "1 cup" },
      { name: "Beef Gravy (thick)", quantity: "1.5 cups" },
      { name: "Frying Oil", quantity: "for deep frying" }
    ],
    procedure: [
      "Step 1: Soak cut potato wedges in cold water for 30 minutes, then drain and dry completely with a towel.",
      "Step 2: Heat oil in a deep fryer to 160°C (325°F). Fry potato wedges for 5 minutes until soft but not browned. Remove and drain.",
      "Step 3: Heat oil to 190°C (375°F). Fry potatoes a second time for 2-3 minutes until golden brown and crispy.",
      "Step 4: Warm the thick beef gravy in a separate saucepan until hot.",
      "Step 5: Put hot crispy fries in a bowl, scatter cheese curds on top, and pour the hot gravy generously over everything to melt the cheese."
    ]
  },
  "Moussaka": {
    recipeType: "Dinner",
    prepTime: "40 min",
    difficulty: "Hard",
    servings: "6 People",
    ingredients: [
      { name: "Eggplant (sliced)", quantity: "2 medium" },
      { name: "Ground Lamb or Beef", quantity: "300 g" },
      { name: "Tomato Sauce", quantity: "1 cup" },
      { name: "Bechamel Sauce", quantity: "1.5 cups" },
      { name: "Onion & Garlic (chopped)", quantity: "1 medium" },
      { name: "Parmesan Cheese", quantity: "1/4 cup" }
    ],
    procedure: [
      "Step 1: Brush eggplant slices with olive oil and bake at 200°C (400°F) for 15-20 minutes until soft.",
      "Step 2: Sauté onion and garlic. Add ground meat, cook until browned, then pour in tomato sauce and simmer for 15 minutes.",
      "Step 3: In a greased baking dish, place a layer of baked eggplant slices, then spread meat sauce on top.",
      "Step 4: Pour rich bechamel sauce over the meat, spreading evenly, and sprinkle with parmesan cheese.",
      "Step 5: Bake at 180°C (350°F) for 35-40 minutes until golden brown and bubbly on top. Let cool for 10 minutes before slicing."
    ]
  }
};

const newRecipesData = [
  {
    name: "French Crepes",
    category: "Veg",
    recipeType: "Breakfast",
    origin: "France",
    prepTime: "15 min",
    difficulty: "Easy",
    servings: "4 People",
    ingredients: [
      { name: "All-Purpose Flour", quantity: "1 cup" },
      { name: "Eggs", quantity: "2 pieces" },
      { name: "Milk", quantity: "1/2 cup" },
      { name: "Water", quantity: "1/2 cup" },
      { name: "Salt", quantity: "1/4 tsp" },
      { name: "Butter (melted)", quantity: "2 tbsp" }
    ],
    procedure: [
      "Step 1: Whisk together flour and eggs. Gradually add in milk and water, stirring continuously to combine.",
      "Step 2: Add salt and melted butter; beat until smooth.",
      "Step 3: Heat a griddle or frying pan over medium-high heat. Lightly grease with oil or butter.",
      "Step 4: Pour batter onto the hot pan (about 1/4 cup for each crepe). Tilt the pan in a circular motion to coat.",
      "Step 5: Cook for 2 minutes, until bottom is golden. Loosen edge, flip, and cook the other side.",
      "Step 6: Serve warm with your choice of sweet fillings like chocolate or fresh fruit."
    ],
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=600&auto=format&fit=crop",
    status: "approved",
    submitterRole: "admin"
  },
  {
    name: "Korean Bibimbap",
    category: "Non-Veg",
    recipeType: "Lunch",
    origin: "Korea",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: "2 People",
    ingredients: [
      { name: "Steamed Jasmine Rice", quantity: "2 cups" },
      { name: "Beef Ribeye (thinly sliced)", quantity: "150 g" },
      { name: "Spinach (blanched)", quantity: "1 bunch" },
      { name: "Bean Sprouts", quantity: "1 cup" },
      { name: "Carrots (julienned)", quantity: "1 small" },
      { name: "Eggs (fried sunny side up)", quantity: "2 pieces" },
      { name: "Gochujang (Korean chili paste)", quantity: "2 tbsp" },
      { name: "Sesame Oil", quantity: "1 tbsp" }
    ],
    procedure: [
      "Step 1: Sauté beef slices in a pan with garlic and soy sauce. Set aside.",
      "Step 2: Blanch spinach and bean sprouts separately, drain, squeeze dry, and season with sesame oil and salt.",
      "Step 3: Lightly sauté the julienned carrots in oil.",
      "Step 4: Spoon hot steamed rice into the bottom of two serving bowls.",
      "Step 5: Arrange beef and all seasoned vegetables in neat sections on top of the rice.",
      "Step 6: Place a fried egg in the center of each bowl.",
      "Step 7: Drizzle sesame oil and place a dollop of Gochujang chili paste. Mix everything thoroughly before eating."
    ],
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop",
    status: "approved",
    submitterRole: "admin"
  },
  {
    name: "Turkish Shakshuka",
    category: "Veg",
    recipeType: "Breakfast",
    origin: "Turkey",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: "3 People",
    ingredients: [
      { name: "Eggs", quantity: "4 pieces" },
      { name: "Canned Diced Tomatoes", quantity: "1 can" },
      { name: "Red Bell Pepper (chopped)", quantity: "1 medium" },
      { name: "Onion (chopped)", quantity: "1 medium" },
      { name: "Garlic (minced)", quantity: "2 cloves" },
      { name: "Cumin Powder", quantity: "1 tsp" },
      { name: "Paprika Powder", quantity: "1 tsp" },
      { name: "Olive Oil", quantity: "2 tbsp" },
      { name: "Feta Cheese (crumbled)", quantity: "for garnish" }
    ],
    procedure: [
      "Step 1: Heat olive oil in a large skillet. Sauté chopped onion and bell pepper until soft (approx 5 minutes).",
      "Step 2: Add minced garlic, cumin, and paprika. Cook for 1 minute until highly fragrant.",
      "Step 3: Pour in canned diced tomatoes with their juice, season with salt and pepper, and simmer on medium-low for 10 minutes until thickened.",
      "Step 4: Use a spoon to make 4 small wells in the sauce. Crack an egg into each well.",
      "Step 5: Cover the skillet and cook on low heat for 5-8 minutes until egg whites are set but yolks remain runny.",
      "Step 6: Sprinkle crumbled feta cheese and fresh cilantro over the top, and serve warm with crusty bread."
    ],
    image: "https://images.unsplash.com/photo-1590412200988-a436bb705300?q=80&w=600&auto=format&fit=crop",
    status: "approved",
    submitterRole: "admin"
  },
  {
    name: "Vietnamese Pho",
    category: "Non-Veg",
    recipeType: "Dinner",
    origin: "Vietnam",
    prepTime: "45 min",
    difficulty: "Hard",
    servings: "4 People",
    ingredients: [
      { name: "Rice Noodles (flat)", quantity: "200 g" },
      { name: "Beef Sirloin (paper-thin slices)", quantity: "150 g" },
      { name: "Beef Soup Bones", quantity: "500 g" },
      { name: "Onion & Ginger (charred)", quantity: "1 piece each" },
      { name: "Star Anise & Cinnamon Bark", quantity: "2 pieces each" },
      { name: "Fish Sauce", quantity: "3 tbsp" },
      { name: "Fresh Bean Sprouts, Basil, Lime", quantity: "for serving" }
    ],
    procedure: [
      "Step 1: Boil beef bones in water for 5 minutes, then drain and rinse. Char the onion and ginger over open flame or grill.",
      "Step 2: In a clean pot, simmer bones, charred onion and ginger, star anise, cinnamon, and fish sauce in water for 3-4 hours (or at least 45 minutes for a quick stock) to build a rich broth.",
      "Step 3: Cook rice noodles according to package directions, drain, and divide into large bowls.",
      "Step 4: Arrange raw, paper-thin beef sirloin slices on top of the warm noodles.",
      "Step 5: Strain the boiling hot broth and ladle it directly over the beef slices. The heat of the broth will cook the beef instantly.",
      "Step 6: Serve hot alongside plates of bean sprouts, fresh Thai basil, lime wedges, hoisin, and sriracha."
    ],
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=600&auto=format&fit=crop",
    status: "approved",
    submitterRole: "admin"
  }
];

const migrateRecipes = async () => {
  try {
    await connectDB();

    // 1. Get the admin user to link recipes to
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('ERROR: No admin user found. Please run "npm run seed:admin" first.');
      process.exit(1);
    }

    console.log(`Found admin user: ${admin.email} (${admin._id})`);

    // 2. Process existing recipes
    const recipes = await Recipe.find({});
    console.log(`Found ${recipes.length} recipe records in MongoDB to migrate.`);

    for (const recipe of recipes) {
      const updateData = updatedRecipesData[recipe.name];
      if (updateData) {
        console.log(`Migrating/Updating existing recipe: "${recipe.name}"...`);
        recipe.recipeType = updateData.recipeType;
        recipe.prepTime = updateData.prepTime;
        recipe.difficulty = updateData.difficulty;
        recipe.servings = updateData.servings;
        recipe.ingredients = updateData.ingredients;
        recipe.procedure = updateData.procedure;
        
        // Ensure user ref is valid
        if (!recipe.user) {
          recipe.user = admin._id;
        }

        await recipe.save();
        console.log(`--> Updated "${recipe.name}" successfully.`);
      } else {
        // Fallback for user-submitted recipes that are not in our seed list
        console.log(`Skipping predefined mapping for "${recipe.name}". Checking for defaults...`);
        let needsSave = false;
        
        if (!recipe.recipeType) {
          recipe.recipeType = 'Dinner'; // default
          needsSave = true;
        }
        if (!recipe.prepTime) {
          recipe.prepTime = '25 min';
          needsSave = true;
        }
        if (!recipe.difficulty) {
          recipe.difficulty = 'Easy';
          needsSave = true;
        }
        if (!recipe.servings) {
          recipe.servings = '2-3 People';
          needsSave = true;
        }

        // Convert string ingredients to structured if any exist
        if (recipe.ingredients && recipe.ingredients.length > 0 && typeof recipe.ingredients[0] === 'string') {
          console.log(`--> Converting string ingredients list to structured formats for: "${recipe.name}"`);
          const structuredIngredients = recipe.ingredients.map(ing => {
            // Regex to match e.g. "2 tbsp Olive Oil" or "500 g Chicken"
            const match = ing.match(/^([\d\/\.\-\s]+(?:tbsp|tsp|g|kg|ml|cups|cup|pcs|pieces|can|stalks|stalk|slices|slice|cloves|clove|leaves|leaf|bunch)?)\s+(.+)$/i);
            if (match) {
              return { quantity: match[1].trim(), name: match[2].trim() };
            } else {
              return { quantity: 'As required', name: ing };
            }
          });
          recipe.ingredients = structuredIngredients;
          needsSave = true;
        }

        if (!recipe.user) {
          recipe.user = admin._id;
          needsSave = true;
        }

        if (needsSave) {
          await recipe.save();
          console.log(`--> Fixed defaults and saved recipe "${recipe.name}".`);
        }
      }
    }

    // 3. Add exactly 4 new recipes if they do not exist
    for (const newRecipe of newRecipesData) {
      const existing = await Recipe.findOne({ name: newRecipe.name });
      if (existing) {
        console.log(`New recipe "${newRecipe.name}" already exists. Updating details...`);
        existing.category = newRecipe.category;
        existing.recipeType = newRecipe.recipeType;
        existing.origin = newRecipe.origin;
        existing.prepTime = newRecipe.prepTime;
        existing.difficulty = newRecipe.difficulty;
        existing.servings = newRecipe.servings;
        existing.ingredients = newRecipe.ingredients;
        existing.procedure = newRecipe.procedure;
        existing.image = newRecipe.image;
        existing.status = 'approved';
        await existing.save();
        console.log(`--> Updated "${newRecipe.name}".`);
      } else {
        console.log(`Adding new recipe: "${newRecipe.name}"...`);
        const recipeDoc = new Recipe({
          user: admin._id,
          ...newRecipe
        });
        await recipeDoc.save();
        console.log(`--> Created "${newRecipe.name}" successfully.`);
      }
    }

    await mongoose.connection.close();
    console.log('Migration script completed successfully! Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Migration script failed: ${error.message}`);
    process.exit(1);
  }
};

migrateRecipes();
