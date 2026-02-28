const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number
    },
    material: {
      primary: String,
      frame: String,
      filling: String
    },
    seatingCapacity: Number,
    colors: [String],
    assembly: String,
    assemblyTime: String,
    spaceEfficient: Boolean,
    style: [String]
  },
  
  images: [String],
  tags: [String],
  roomType: String,
  
  views: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Fix: Check if model exists before compiling
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);