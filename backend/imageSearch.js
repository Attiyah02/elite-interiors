const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');

console.log('Ì∂ºÔ∏è  ImageSearch route file loaded!');

// Configure multer
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('Ì≥Å File received:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

router.get('/test', (req, res) => {
  console.log('‚úÖ Test route hit!');
  res.json({ message: 'Image search working!' });
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Ì∂ºÔ∏è  POST hit!');
    if (!req.file) {
      return res.status(400).json({ message: 'No image' });
    }
    console.log('‚úÖ File:', req.file.originalname, req.file.size);
    const products = await Product.find({ inStock: true }).limit(12);
    console.log('Ì≥¶ Found', products.length, 'products');
    res.json({
      detectedLabels: ['Furniture'],
      detectedColors: ['Brown'],
      detectedFurniture: ['furniture'],
      count: products.length,
      products: products.map(p => ({ ...p.toObject(), relevanceScore: 50 }))
    });
  } catch (error) {
    console.error('‚ùå Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
