const MealPlan = require('../models/MealPlan');
const { parseQuantity } = require('../utils/helpers');

// @desc    Generate shopping list with summed quantities
// @route   GET /api/shopping-list/:mealPlanId
// @access  Private
exports.getShoppingList = async (req, res, next) => {
  try {
    let mealPlans;

    if (req.params.mealPlanId) {
      // Single meal plan
      const mealPlan = await MealPlan.findOne({ _id: req.params.mealPlanId, user: req.user._id })
        .populate('meals.recipe');
      if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
      mealPlans = [mealPlan];
    } else {
      // All meal plans for this user
      mealPlans = await MealPlan.find({ user: req.user._id }).populate('meals.recipe');
      if (!mealPlans.length) return res.json([]);
    }

    const ingredientMap = {};

    mealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        meal.recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();

          if (!ingredientMap[key]) {
            ingredientMap[key] = { name: ing.name, values: [], raw: [] };
          }

          const parsed = parseQuantity(ing.quantity);
          if (parsed) {
            ingredientMap[key].values.push(parsed);
          } else {
            ingredientMap[key].raw.push(ing.quantity);
          }
        });
      });
    });

    const shoppingList = Object.values(ingredientMap).map(item => {
      const unitTotals = {};
      item.values.forEach(q => {
        if (!unitTotals[q.unit]) unitTotals[q.unit] = 0;
        unitTotals[q.unit] += q.value;
      });

      const summed = Object.entries(unitTotals)
        .map(([unit, val]) => `${val}${unit}`)
        .join(' + ');

      const raw = item.raw.join(' + ');
      const totalQuantity = [summed, raw].filter(Boolean).join(' + ');

      return { name: item.name, totalQuantity };
    });

    res.json(shoppingList);
  } catch (err) {
    next(err);
  }
};

