const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      totalAmount: 2500,
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