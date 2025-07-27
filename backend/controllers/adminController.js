const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Hide passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Recipe = require('../models/Recipe');

// Get all recipes (admin only)
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author', 'name email');
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Force delete a recipe (admin only)
exports.deleteRecipeAdmin = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        await recipe.deleteOne();
        res.json({ message: 'Recipe deleted by admin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
