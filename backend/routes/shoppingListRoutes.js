const express = require('express');
const { getShoppingList } = require('../controllers/shoppingListController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:mealPlanId', auth, getShoppingList);

module.exports = router;
