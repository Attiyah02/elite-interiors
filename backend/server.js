const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - CORS configured for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://elite-interiors-phi.vercel.app',
    'https://elite-interiors-phi-git-main.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEMPORARY DEBUG ROUTES - Add before your other routes
app.get('/api/test-reports', async (req, res) => {
  const Order = require('./models/Order');
  const Product = require('./models/Product');
  const User = require('./models/User');

  try {
    // Test 1: Financial Report
    console.log('Testing financial report...');
    const orders = await Order.find({ status: 'complete' });
    console.log('Complete orders:', orders.length);
    
    let totalRevenue = 0;
    let totalCost = 0;
    
    for (const order of orders) {
      totalRevenue += order.total || 0;
      console.log('Processing order:', order._id, 'Total:', order.total);
      
      for (const item of order.items) {
        console.log('  Item:', item.name, 'ProductID:', item.productId);
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            const cost = product.costPrice || (product.price * 0.6);
            totalCost += cost * item.quantity;
            console.log('    Product found, cost:', cost);
          } else {
            console.log('    Product NOT found for ID:', item.productId);
          }
        } catch (err) {
          console.log('    Error fetching product:', err.message);
        }
      }
    }
    
    // Test 2: Product Report
    console.log('\nTesting product report...');
    const products = await Product.find().limit(5);
    console.log('Products found:', products.length);
    
    // Test 3: Customer Report
    console.log('\nTesting customer report...');
    const customers = await User.find({ role: 'customer' });
    console.log('Customers found:', customers.length);
    
    res.json({
      success: true,
      financial: { totalRevenue, totalCost, ordersCount: orders.length },
      products: products.length,
      customers: customers.length
    });
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('📧 Testing email configuration...');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
    
    const { sendOrderConfirmation } = require('./utils/emailService');
    
    // Create a test order
    const testOrder = {
      _id: '507f1f77bcf86cd799439011',
      total: 2500,
      paymentMethod: 'card',
      createdAt: new Date(),
      items: [
        {
          productId: { name: 'Cloud Comfort Sofa' },
          quantity: 1,
          price: 2500
        }
      ]
    };
    
    const testUser = {
      name: 'Test Customer',
      email: process.env.EMAIL_USER
    };
    
    console.log('📤 Sending test email to:', testUser.email);
    
    const result = await sendOrderConfirmation(testOrder, testUser);
    
    if (result) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully! Check your inbox.',
        sentTo: testUser.email
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Email failed to send - check backend logs for errors'
      });
    }
    
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error.stack
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));

try {
  app.use('/api/image-search', require('./routes/imageSearch'));
  console.log('✅ Image search route loaded successfully');
} catch (error) {
  console.error('❌ Failed to load image search route:', error.message);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));