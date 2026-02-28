const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmation, sendAdminOrderNotification } = require('../utils/emailService');

// @POST /api/orders
const createOrder = async (req, res) => {
  try {
    console.log('📦 Creating order...');
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.user.userId:', req.user?.userId);
    console.log('🔍 req.user._id:', req.user?._id);
    console.log('🔍 req.user.id:', req.user?.id);

    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      const itemPrice = product.price * (1 - (product.discount || 0) / 100);

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice
      });

      total += itemPrice * item.quantity;
    }

    // Create order - try both _id and userId
    const order = await Order.create({
      userId: req.user._id || req.user.userId,
      items: orderItems,
      total: total,
      paymentMethod: paymentMethod || 'card',
      status: 'pending'
    });

    // Populate product details for email
    await order.populate('items.productId');

    // Get user for emails
    const user = await User.findById(req.user._id || req.user.userId);
    
    // Send customer confirmation
    sendOrderConfirmation(order, user).catch(err => 
      console.error('Email error:', err)
    );
    
    // Send admin notification
    sendAdminOrderNotification(order, user).catch(err => 
      console.error('Admin email error:', err)
    );

    console.log('✅ Order created successfully:', order._id);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name images price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const userId = req.user._id || req.user.userId;
    
    // Make sure user owns this order
    if (order.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };