const Comment = require('../models/Comment');

exports.addComment = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            recipe: req.params.recipeId,
            user: req.user._id,
            text: req.body.text
        });
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

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

exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        next(err);
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        comment.text = req.body.text;
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (err) {
        next(err);
    }
};