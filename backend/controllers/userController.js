const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.id;

        const index = user.favorites.indexOf(recipeId);
        if (index === -1) {
            user.favorites.push(recipeId);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get my favorites
exports.getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
