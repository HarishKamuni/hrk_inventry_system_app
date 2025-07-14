const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockHistory', stockHistorySchema);
