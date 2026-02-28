const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getTopSelling,
  getOnSale,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  aiSearch
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/featured/top-selling', getTopSelling);
router.get('/featured/on-sale', getOnSale);
router.post('/ai-search', aiSearch);
router.get('/:id', getProductById);
router.get('/:id/similar', getSimilarProducts);

// Admin only routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;