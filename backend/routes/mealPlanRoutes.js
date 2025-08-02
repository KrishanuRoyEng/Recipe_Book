const express = require('express');
const { createOrUpdateMealPlan, getMealPlans, getMealPlanById, deleteMealPlan } = require('../controllers/mealPlanController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(auth, getMealPlans)
    .post(auth, createOrUpdateMealPlan);

router.route('/:id')
    .get(auth, getMealPlanById)

router.delete('/:planId/meals/:mealId', auth, deleteMealPlan);

module.exports = router;
