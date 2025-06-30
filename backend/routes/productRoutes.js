const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  searchProducts,
} = require('../controllers/productController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, manager, createProduct);
router.route('/search').get(protect, searchProducts);
router
  .route('/:id')
  .get(protect, getProductById)
  .put(protect, manager, updateProduct)
  .delete(protect, manager, deleteProduct);
router.route('/:id/stock').put(protect, manager, updateStock);

module.exports = router;