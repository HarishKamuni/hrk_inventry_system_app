const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

const router = express.Router();

router.get('/', protect, getSuppliers);
router.post('/', protect, adminOnly, createSupplier);
router.put('/:id', protect, adminOnly, updateSupplier);
router.delete('/:id', protect, adminOnly, deleteSupplier);

module.exports = router;
