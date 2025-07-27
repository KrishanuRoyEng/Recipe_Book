const Recipe = require('../models/Recipe');

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps, tags, cuisine, prepTime, difficulty } = req.body;

        const recipeData = {
            title,
            description,
            ingredients,
            steps,
            tags,
            cuisine,
            prepTime,
            difficulty,
            author: req.user._id
        };

        // Add uploaded image if present
        if (req.file) {
            recipeData.image = req.file.path; // Cloudinary URL
        }

        const recipe = await Recipe.create(recipeData);
        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all recipes (with optional search/filter)
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
    try {
        const { search, tags, cuisine, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) query.title = { $regex: search, $options: 'i' };
        if (tags) query.tags = { $in: tags.split(',') };
        if (cuisine) query.cuisine = cuisine;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Recipe.countDocuments(query);

        const recipes = await Recipe.find(query)
            .populate('author', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            results: recipes
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'name email');
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        // Only author can edit
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Merge new data
        Object.assign(recipe, req.body);

        // Update image if a new one is uploaded
        if (req.file) {
            recipe.image = req.file.path; // Cloudinary URL
        }

        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        // Only author can delete
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await recipe.deleteOne();
        res.json({ message: 'Recipe removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
exports.rateRecipe = async (req, res) => {
    try {
        const { rating } = req.body;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be 1-5' });
        }

        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const existingRatingIndex = recipe.ratings.findIndex(r => r.user.toString() === req.user._id.toString());

        if (existingRatingIndex > -1) {
            recipe.ratings[existingRatingIndex].rating = rating;
        } else {
            recipe.ratings.push({ user: req.user._id, rating });
        }

        await recipe.save();
        res.json({ ratings: recipe.ratings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
