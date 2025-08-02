const Comment = require('../models/Comment');

// Add comment (already done)
exports.addComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      recipe: req.params.recipeId,
      user: req.user._id,
      text: req.body.text
    });
    await comment.populate('user', 'name');
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// Get comments (paginated)
exports.getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ recipe: req.params.recipeId });
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: comments
    });
  } catch (err) {
    next(err);
  }
};

// Edit comment
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.text = req.body.text;
    await comment.save();
    await comment.populate('user', 'name');
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};