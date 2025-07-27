const express = require('express');
const { addComment, getComments, deleteComment, updateComment } = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getComments)            // Public - Get comments for a recipe
    .post(auth, addComment);     // Private - Add a comment

router.route('/:id')
    .put(auth, updateComment)  // Private - Update own comment
    .delete(auth, role('admin'), deleteComment); // Private - Delete own comment

module.exports = router;
