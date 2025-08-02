const MealPlan = require('../models/MealPlan');

// @desc    Create or update a meal plan for a week
// @route   POST /api/meal-plans
// @access  Private
exports.createOrUpdateMealPlan = async (req, res) => {
    try{
        const {weekStart, meals} = req.body;
        let plan = await MealPlan.findOne({user: req.user._id, weekStart});

        if(plan){
            plan.meals = meals;
            await plan.save();
        } else {
            plan = await MealPlan.create({
                user: req.user._id,
                weekStart,
                meals
            });
        }

        res.json(plan);
    } catch(err){
        console.error("MealPlan error:", err);
        res.status(500).json({message: err.message});
    }
};

// @desc    Get all meal plans for current user
// @route   GET /api/meal-plans
// @access  Private
exports.getMealPlans = async (req, res) => {
    try {
        const plans = await MealPlan.find({ user: req.user._id }).populate('meals.recipe');
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get a single meal plan by ID
// @route   GET /api/meal-plans/:id
// @access  Private
exports.getMealPlanById = async (req, res) => {
    try {
        const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id }).populate('meals.recipe');
        if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete a meal plan
// @route   DELETE /api/meal-plans/:id
// @access  Private
exports.deleteMealPlan = async (req, res) => {
  try {
    const { planId, mealId } = req.params;
    const plan = await MealPlan.findOne({ _id: planId, user: req.user._id }).populate('meals.recipe');
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });

    plan.meals = plan.meals.filter(m => m._id.toString() !== mealId);
    await plan.save();

    res.json(plan); // Return the updated plan with populated recipes
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};