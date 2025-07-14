const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const exists = await Supplier.findOne({ name });
    if (exists)
      return res.status(400).json({ message: 'Supplier already exists' });

    const supplier = await Supplier.create({ name, contact });
    res.status(201).json(supplier);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating supplier', error: err.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error getting suppliers', error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: 'Supplier not found' });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating supplier', error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting supplier', error: err.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
