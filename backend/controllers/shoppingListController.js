const MealPlan = require('../models/MealPlan');
const { parseQuantity } = require('../utils/helpers');

// @desc    Generate shopping list with summed quantities
// @route   GET /api/shopping-list/:mealPlanId
// @access  Private
exports.getShoppingList = async (req, res, next) => {
    try {
        const mealPlan = await MealPlan.findOne({ _id: req.params.mealPlanId, user: req.user._id })
            .populate('meals.recipe');
        if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });

        const ingredientMap = {};

        mealPlan.meals.forEach(meal => {
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

        const shoppingList = Object.values(ingredientMap).map(item => {
            // Group by unit and sum values
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
