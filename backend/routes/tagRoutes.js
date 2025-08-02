const express = require('express');
const router = express.Router();
const Tag = require('../models/Tags');
const auth = require('../middlewares/authMiddleware');

// Get all tags (public)
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new tag (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const tag = await Tag.create({ name: req.body.name, color: req.body.color });
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete tag (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    await tag.deleteOne();
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
