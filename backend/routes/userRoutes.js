const express = require('express');
const { getMe, toggleFavorite, getMyFavorites } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/me', auth, getMe); // Fetch my profile
router.post('/me/favorites/:id', auth, toggleFavorite);
router.get('/me/favorites', auth, getMyFavorites);

module.exports = router;