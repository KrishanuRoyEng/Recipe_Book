const express = require('express');
const { getAllUsers, updateUserRole, deleteUser, getAllRecipes, deleteRecipeAdmin } = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const User = require('../models/User');
const router = express.Router();

// Admin-only routes
router.use(auth, role('admin'));

// User management
router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  const { search = '', page = 1, limit = 10 } = req.query;

  const query = search 
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query).skip(skip).limit(parseInt(limit)).select('-password');

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    results: users
  });
});
router.patch('/users/:id/role', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

  const { role } = req.body;
  if (!['user','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json(user);
});
router.delete('/users/:id', deleteUser);    // Delete a user

// Recipe management
router.get('/recipes', getAllRecipes); // List all recipes
router.delete('/recipes/:id', deleteRecipeAdmin); // Delete a recipe

module.exports = router;
