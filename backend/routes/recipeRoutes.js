const express = require('express');
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const { rateRecipe } = require('../controllers/recipeController');
const auth = require('../middlewares/authMiddleware');
const { ratingValidator, handleValidation } = require('../middlewares/validationMiddleware');
const commentRoutes = require('./commentRoutes')
const upload = require('../middlewares/uploadMiddleware');
const role = require('../middlewares/roleMiddleware');
const router = express.Router();

router.use('/:recipeId/comments', commentRoutes);

router.route('/')
    .get(getRecipes)       // Public - Get all recipes
    .post(auth, upload.single('image'), createRecipe); // Private - Create recipe

router.route('/:id')
    .get(getRecipeById)    // Public - Get single recipe
    .put(auth, upload.single('image'), updateRecipe)  // Private - Update recipe
    .delete(auth, role('admin'), deleteRecipe); // Private - Only admin can Delete recipe

router.post('/:id/rate', auth, ratingValidator, handleValidation, rateRecipe); // Private - Rate recipe

module.exports = router;