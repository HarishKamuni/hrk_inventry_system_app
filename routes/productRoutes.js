const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getStockHistory,
  getLowStockProducts,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
// Add after other routes
router.put('/:id/stock-in', protect, adminOnly, stockIn);
router.put('/:id/stock-out', protect, adminOnly, stockOut);
// View all stock logs (admin only)
router.get('/stock/history', protect, adminOnly, getStockHistory);

// Get low-stock items
router.get('/stock/low', protect, adminOnly, getLowStockProducts);

module.exports = router;
