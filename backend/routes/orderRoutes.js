const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrders,
  getMyOrders,
  getOrdersByDateRange,
  getSalesSummary,
} = require('../controllers/orderController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, manager, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/report').get(protect, manager, getOrdersByDateRange);
router.route('/sales-summary').get(protect, manager, getSalesSummary);
router.route('/:id').get(protect, getOrderById);

module.exports = router;