require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('=== DB VERIFICATION ===\n');

  const total = await Recipe.countDocuments();
  const approved = await Recipe.countDocuments({ status: 'approved' });
  const pending = await Recipe.countDocuments({ status: 'pending' });
  console.log('RECIPES: total=' + total + ', approved=' + approved + ', pending=' + pending);

  // 3. Recipes with no recipeType
  const noType = await Recipe.countDocuments({ recipeType: { $exists: false } });
  const emptyType = await Recipe.countDocuments({ recipeType: '' });
  console.log('CHECK 3 - Missing recipeType: ' + noType + ', empty: ' + emptyType);

  // 4. Ingredients structure check
  const all = await Recipe.find({}, 'name ingredients');
  let badIngredients = [];
  for (const r of all) {
    if (!r.ingredients || r.ingredients.length === 0) {
      badIngredients.push(r.name + ' [empty]');
      continue;
    }
    const firstIng = r.ingredients[0];
    const isObj = firstIng && typeof firstIng === 'object' && firstIng.name !== undefined;
    if (!isObj) {
      badIngredients.push(r.name + ' [not object]');
      continue;
    }
    const missingName = r.ingredients.some(i => !i.name || i.name.trim() === '');
    const missingQty = r.ingredients.some(i => !i.quantity || i.quantity.trim() === '');
    if (missingName) badIngredients.push(r.name + ' [missing name]');
    if (missingQty) badIngredients.push(r.name + ' [missing qty]');
  }
  console.log('CHECK 4 - Ingredients with issues: ' + badIngredients.length);
  if (badIngredients.length > 0) badIngredients.forEach(b => console.log('  BAD: ' + b));

  // 5. Procedure steps < 4
  const allRecipes = await Recipe.find({}, 'name procedure');
  const shortProc = allRecipes.filter(r => !r.procedure || r.procedure.length < 4);
  console.log('CHECK 5 - Recipes with < 4 procedure steps: ' + shortProc.length);
  if (shortProc.length > 0) shortProc.forEach(r => console.log('  - ' + r.name + ' (' + (r.procedure ? r.procedure.length : 0) + ' steps)'));

  // 6. New diverse recipes
  const divNames = ['French Crepes', 'Korean Bibimbap', 'Turkish Shakshuka', 'Vietnamese Pho'];
  console.log('CHECK 6 - New diverse recipes:');
  for (const n of divNames) {
    const found = await Recipe.countDocuments({ name: n });
    console.log('  ' + n + ': ' + (found === 1 ? 'FOUND OK' : found === 0 ? '*** MISSING ***' : '*** DUPLICATE x' + found + ' ***'));
  }

  // 7. Duplicate recipe names
  const pipeline = [
    { $group: { _id: '$name', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ];
  const duplicates = await Recipe.aggregate(pipeline);
  console.log('CHECK 7 - Duplicate recipe names: ' + duplicates.length);
  if (duplicates.length > 0) duplicates.forEach(d => console.log('  DUPE: ' + d._id + ' x' + d.count));

  // 8. Contributors
  const contributors = await User.countDocuments({ role: { $in: ['cook', 'admin'] } });
  const allUsers = await User.find({ role: { $in: ['cook', 'admin'] } }, 'name role email');
  console.log('CHECK 8 - Contributors (cook+admin): ' + contributors);
  allUsers.forEach(u => console.log('  ' + u.role + ': ' + u.name + ' <' + u.email + '>'));

  // 9. Newsletter subscribers
  const subs = await Subscriber.find({});
  console.log('CHECK 9 - Newsletter subscribers: ' + subs.length);
  if (subs.length > 0) subs.forEach(s => console.log('  ' + s.email));

  // Full sample recipe
  const sample = await Recipe.findOne({ name: 'Korean Bibimbap' });
  if (sample) {
    console.log('\nSAMPLE - Korean Bibimbap:');
    console.log('  recipeType:', sample.recipeType);
    console.log('  difficulty:', sample.difficulty);
    console.log('  prepTime:', sample.prepTime);
    console.log('  servings:', sample.servings);
    console.log('  ingredients count:', sample.ingredients.length);
    console.log('  procedure steps:', sample.procedure.length);
    console.log('  first ingredient:', JSON.stringify(sample.ingredients[0]));
    console.log('  first step:', sample.procedure[0].substring(0, 80) + '...');
  } else {
    console.log('\nSAMPLE - Korean Bibimbap: NOT FOUND IN DB');
  }

  await mongoose.disconnect();
  console.log('\n=== DB CHECK COMPLETE ===');
}).catch(e => {
  console.error('DB Connection Error:', e.message);
  process.exit(1);
});
