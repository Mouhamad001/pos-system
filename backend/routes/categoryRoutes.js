const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCategories).post(protect, manager, createCategory);
router
  .route('/:id')
  .get(protect, getCategoryById)
  .put(protect, manager, updateCategory)
  .delete(protect, manager, deleteCategory);

module.exports = router;