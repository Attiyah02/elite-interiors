const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  subcategories: [String],
  icon: String,
  createdAt: { type: Date, default: Date.now }
});

// Fix: Check if model exists before compiling
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);