const Recipe = require('../models/Recipe');

// Helper to safely parse JSON fields
const parseJSON = (field) => {
  try { return JSON.parse(field); } catch { return []; }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
  try {
    // Parse JSON fields safely
    const ingredients = req.body.ingredients ? parseJSON(req.body.ingredients) : [];
    const steps = req.body.steps ? parseJSON(req.body.steps) : [];
    const tags = req.body.tags ? parseJSON(req.body.tags) : [];

    const recipeData = {
      title: req.body.title,
      description: req.body.description,
      ingredients,
      steps,
      tags,
      cuisine: req.body.cuisine,
      prepTime: req.body.prepTime,
      difficulty: req.body.difficulty,
      author: req.user._id
    };

    // Add uploaded image if present
    if (req.file) {
      recipeData.image = req.file.path; // Cloudinary URL
    }

    const recipe = await Recipe.create(recipeData);
    res.status(201).json(recipe);
  } catch (err) {
    console.error('Create Recipe Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all recipes (with optional search/filter)
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  try {
    const { search, tags, difficulty, page = 1, limit = 10 } = req.query;
    let query = {};

    // Text search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      const objectIds = tagArray.map((t) => mongoose.Types.ObjectId(t));

      // Auto AND for multiple tags, OR for one tag
      query.tags = tagArray.length > 1
        ? { $all: objectIds } // must include ALL selected
        : { $in: objectIds }; // single tag, match any
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Recipe.countDocuments(query);

    const recipes = await Recipe.find(query)
      .populate("author", "name email")
      .populate("tags", "name color")
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
        const recipe = await Recipe.findById(req.params.id)
          .populate("author", "name email role")
          .populate("comments.user", "name")
          .populate('tags', 'name color')
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
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name role');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Author or admin only
    if (
      recipe.author._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Helper to safely parse JSON
    const parseJSON = (field) => {
      try { return JSON.parse(field); } catch { return []; }
    };

    // Parse fields if they exist
    if (req.body.ingredients) recipe.ingredients = parseJSON(req.body.ingredients);
    if (req.body.steps) recipe.steps = parseJSON(req.body.steps);

    // Tags: accept either JSON (stringified) or array of IDs
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        recipe.tags = req.body.tags;
      } else {
        recipe.tags = parseJSON(req.body.tags);
      }
    }

    // Assign other simple fields
    const allowedFields = ['title', 'description', 'cuisine', 'prepTime', 'difficulty'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) recipe[field] = req.body[field];
    });

    // Handle image upload
    if (req.file) recipe.image = req.file.path;

    // Save and repopulate tags so frontend gets tag names & colors
    const updatedRecipe = await recipe.save();
    await updatedRecipe.populate('tags', 'name color');

    res.json(updatedRecipe);
  } catch (err) {
    console.error('Update Recipe Error:', err);
    res.status(500).json({ message: 'Something went wrong while updating the recipe.' });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
  console.log("Delete Recipe:", req.params.id);
  try {
    const recipe = await Recipe.findById(req.params.id);
    console.log("Deleting recipe:", req.params.id, "by user:", req.user._id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const authorId = recipe.author._id?.toString() || recipe.author.toString();
    console.log("Author ID:", authorId, "User ID:", req.user._id);

    if (authorId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deleted = await Recipe.deleteOne({ _id: recipe._id }); // <— Change here
    console.log("Delete result:", deleted);

    res.json({ message: 'Recipe removed' });
  } catch (err) {
    console.error("Delete Recipe Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
exports.rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Remove old rating by this user if exists
    recipe.ratings = recipe.ratings.filter(r => r.user.toString() !== req.user._id.toString());
    recipe.ratings.push({ user: req.user._id, rating });
    await recipe.save();

    // Compute average
    const average =
      recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;

    res.status(201).json({ average }); // <-- Ensure we send it back
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    get my recipes
// @route   GET /api/recipes/my
// @access  Private
exports.getMyRecipes = async (req, res) => {
  try {
    console.log("User:", req.user); // Debug
    const recipes = await Recipe.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error("getMyRecipes error:", err);
    res.status(500).json({ message: err.message });
  }
};