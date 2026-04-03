const express = require('express');
const router = express.Router();
const { getProgress, addProgress, getAnalytics, generateDemoData } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/analytics', protect, getAnalytics);
router.post('/demo', protect, generateDemoData);
router.route('/').get(protect, getProgress).post(protect, addProgress);

module.exports = router;
