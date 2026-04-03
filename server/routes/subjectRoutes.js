const express = require('express');
const router = express.Router();
const { getSubjects, createSubject, deleteSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSubjects).post(protect, createSubject);
router.route('/:id').delete(protect, deleteSubject);

module.exports = router;
