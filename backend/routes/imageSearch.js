const express = require('express');
const router = express.Router();
const multer = require('multer');
const vision = require('@google-cloud/vision');
const Product = require('../models/Product');

console.log('🖼️  ImageSearch route file loaded!');

// Configure multer
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// Initialize Vision API
const visionClient = new vision.ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_VISION_API_KEY
});

console.log('🔑 Vision API:', process.env.GOOGLE_VISION_API_KEY ? 'Configured ✅' : 'Not configured ❌');

// Helper function
function rgbToColorName(rgb) {
  const r = rgb.red || 0;
  const g = rgb.green || 0;
  const b = rgb.blue || 0;

  if (r < 50 && g < 50 && b < 50) return 'black';
  if (r > 200 && g > 200 && b > 200) return 'white';
  if (r > 150 && g < 100 && b < 100) return 'red';
  if (r < 100 && g > 150 && b < 100) return 'green';
  if (r < 100 && g < 100 && b > 150) return 'blue';
  if (r > 150 && g > 150 && b < 100) return 'yellow';
  if (r > 120 && g > 80 && b < 80) return 'brown';
  if (r > 100 && g > 100 && b > 100) return 'grey';
  if (r > 150 && g > 120 && b < 100) return 'beige';
  return 'neutral';
}

router.get('/test', (req, res) => {
  console.log('✅ Test route hit!');
  res.json({ 
    message: 'Image search working!',
    usingAI: !!process.env.GOOGLE_VISION_API_KEY
  });
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('🖼️  POST hit!');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image' });
    }

    console.log('✅ File:', req.file.originalname, req.file.size, 'bytes');

    // Check if API key exists
    if (!process.env.GOOGLE_VISION_API_KEY) {
      console.log('⚠️  No API key - using basic search');
      
      // Fallback: Basic search without AI
      const products = await Product.find({ inStock: true }).limit(12);
      return res.json({
        detectedLabels: ['Furniture', 'Interior'],
        detectedColors: ['Brown', 'Neutral'],
        detectedFurniture: ['furniture'],
        count: products.length,
        products: products.map(p => ({ ...p.toObject(), relevanceScore: 50 })),
        usingAI: false
      });
    }

    console.log('🔍 Calling Google Vision API...');

    // Call Vision API - Labels
    const [labelResult] = await visionClient.labelDetection({
      image: { content: req.file.buffer }
    });

    const labels = labelResult.labelAnnotations || [];
    console.log('🏷️  Labels:', labels.slice(0, 5).map(l => l.description));

    // Call Vision API - Colors
    const [colorResult] = await visionClient.imageProperties({
      image: { content: req.file.buffer }
    });

    const colors = colorResult.imagePropertiesAnnotation?.dominantColors?.colors || [];
    const dominantColors = colors
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(c => rgbToColorName(c.color));

    console.log('🎨 Colors:', dominantColors);

    // Extract furniture keywords
    const furnitureKeywords = [
      'furniture', 'chair', 'table', 'sofa', 'couch', 'bed', 'desk', 
      'cabinet', 'shelf', 'storage', 'dresser', 'nightstand', 'wardrobe'
    ];

    const detectedFurniture = labels
      .filter(label => 
        furnitureKeywords.some(keyword => 
          label.description.toLowerCase().includes(keyword)
        )
      )
      .map(l => l.description.toLowerCase());

    console.log('🪑 Furniture:', detectedFurniture);

    // Build search query
    let filter = { inStock: true };

    if (detectedFurniture.length > 0) {
      filter.$or = detectedFurniture.map(item => ({
        $or: [
          { name: { $regex: item, $options: 'i' } },
          { description: { $regex: item, $options: 'i' } },
          { subcategory: { $regex: item, $options: 'i' } },
          { tags: { $elemMatch: { $regex: item, $options: 'i' } } }
        ]
      }));
    }

    let products = await Product.find(filter).limit(50);

    console.log('📦 Found', products.length, 'products');

    // Score products
    const scoredProducts = products.map(product => {
      let score = 0;

      detectedFurniture.forEach(furniture => {
        if (product.name.toLowerCase().includes(furniture)) score += 10;
        if (product.description.toLowerCase().includes(furniture)) score += 5;
      });

      if (product.specifications?.colors) {
        dominantColors.forEach(color => {
          const hasColor = product.specifications.colors.some(c => 
            c.toLowerCase().includes(color.toLowerCase())
          );
          if (hasColor) score += 15;
        });
      }

      return { ...product.toObject(), relevanceScore: score };
    });

    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const filteredProducts = scoredProducts.filter(p => p.relevanceScore > 5);
    const finalProducts = filteredProducts.length > 0 
      ? filteredProducts.slice(0, 20)
      : scoredProducts.slice(0, 8);

    console.log('✅ Returning', finalProducts.length, 'products (AI-powered)');

    res.json({
      detectedLabels: labels.slice(0, 10).map(l => l.description),
      detectedColors: dominantColors,
      detectedFurniture,
      count: finalProducts.length,
      products: finalProducts,
      usingAI: true
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        message: 'Vision API authentication failed',
        error: 'Check your GOOGLE_VISION_API_KEY'
      });
    }

    res.status(500).json({ 
      message: 'Image search failed', 
      error: error.message 
    });
  }
});

module.exports = router;