const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    day: { type: String, required: true },       // e.g., "Monday"
    mealType: { type: String, required: true },  // e.g., "Breakfast", "Lunch", "Dinner"
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }
});

const mealPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true }, // Start date of the week
    meals: [mealSchema]
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
