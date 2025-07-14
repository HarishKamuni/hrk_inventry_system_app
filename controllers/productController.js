const Category = require('../models/Category');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');
const Supplier = require('../models/Supplier');

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, sku, description, quantity, price, category, supplier } =
      req.body;

    // Validate references
    const categoryExists = await Category.findById(category);
    const supplierExists = await Supplier.findById(supplier);

    if (!categoryExists || !supplierExists) {
      return res
        .status(400)
        .json({ message: 'Invalid category or supplier ID' });
    }

    const exists = await Product.findOne({ sku });
    if (exists) return res.status(400).json({ message: 'SKU already exists' });

    const product = await Product.create({
      name,
      sku,
      description,
      quantity,
      price,
      category,
      supplier,
      addedBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name contact')
      .populate('addedBy', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

//stockIn
const stockIn = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity += quantity;
    await product.save();

    await StockHistory.create({
      product: product._id,
      type: 'in',
      quantity,
      user: req.user.id,
      note,
    });

    res.json({
      message: 'Stock added successfully',
      updatedQuantity: product.quantity,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

//stockOut
const stockOut = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.quantity -= quantity;
    await product.save();

    await StockHistory.create({
      product: product._id,
      type: 'out',
      quantity,
      user: req.user.id,
      note,
    });

    res.json({
      message: 'Stock deducted successfully',
      updatedQuantity: product.quantity,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.query;
    const filter = {};

    if (productId) {
      filter.product = productId;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const history = await StockHistory.find(filter)
      .populate('product', 'name sku')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.limit) || 10;
    const lowStock = await Product.find({ quantity: { $lt: threshold } });
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getStockHistory,
  getLowStockProducts,
};
