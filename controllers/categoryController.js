const Category = require('../models/Category');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating category', error: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error getting categories', error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating category', error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting category', error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
