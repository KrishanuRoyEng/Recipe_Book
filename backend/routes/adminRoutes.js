const express = require('express');
const { getAllUsers, updateUserRole, deleteUser, getAllRecipes, deleteRecipeAdmin } = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const router = express.Router();

// Admin-only routes
router.use(auth, role('admin'));

// User management
router.get('/users', getAllUsers);          // List all users
router.put('/users/:id/role', updateUserRole); // Change a user's role
router.delete('/users/:id', deleteUser);    // Delete a user

// Recipe management
router.get('/recipes', getAllRecipes); // List all recipes
router.delete('/recipes/:id', deleteRecipeAdmin); // Delete a recipe

module.exports = router;
