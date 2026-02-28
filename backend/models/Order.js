const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'paypal'], required: true },
  status: { type: String, enum: ['pending', 'complete'], default: 'complete' },
  createdAt: { type: Date, default: Date.now }
});

// Fix: Check if model exists before compiling
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);