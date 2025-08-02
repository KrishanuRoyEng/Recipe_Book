const express = require('express');
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getMyRecipes } = require('../controllers/recipeController');
const { rateRecipe } = require('../controllers/recipeController');
const auth = require('../middlewares/authMiddleware');
const { ratingValidator, handleValidation } = require('../middlewares/validationMiddleware');
const commentRoutes = require('./commentRoutes')
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.use('/:recipeId/comments', commentRoutes);

router.route('/')
    .get(getRecipes)       // Public - Get all recipes
    .post(auth, upload.single('image'), createRecipe); // Private - Create recipe

router.get('/my', auth, getMyRecipes); // Private - Get my recipes

router.route('/:id')
    .get(getRecipeById)    // Public - Get single recipe
    .put(auth, upload.single('image'), updateRecipe)  // Private - Update recipe
    .delete(auth, deleteRecipe); // Private - Only admins or authors can Delete recipe

router.post('/:id/rate', auth, ratingValidator, handleValidation, rateRecipe); // Private - Rate recipe

module.exports = router;