const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, startDate, endDate } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('userId', 'email profile')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get order stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ userId: customer._id });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        return {
          ...customer.toObject(),
          orderCount: orders.length,
          totalSpent
        };
      })
    );

    res.json(customersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/reports/financial
const getFinancialReport = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'complete' });

    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate cost of sales
    let totalCost = 0;
    for (const order of orders) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          totalCost += product.costPrice * item.quantity;
        }
      }
    }

    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Monthly revenue breakdown
    const monthlyRevenue = {};
    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric'
      });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
    });

    // Payment method breakdown
    const paymentBreakdown = {};
    orders.forEach(order => {
      paymentBreakdown[order.paymentMethod] =
        (paymentBreakdown[order.paymentMethod] || 0) + order.total;
    });

    res.json({
      summary: {
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin: profitMargin.toFixed(2),
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
      },
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      })),
      paymentBreakdown: Object.entries(paymentBreakdown).map(([method, amount]) => ({
        method,
        amount
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/reports/products
const getProductReport = async (req, res) => {
  try {
    // Best selling products
    const bestSelling = await Product.find()
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name category salesCount price views');

    // Most viewed products
    const mostViewed = await Product.find()
      .sort({ views: -1 })
      .limit(10)
      .select('name category views salesCount price');

    // Sales by category
    const allProducts = await Product.find();
    const categoryStats = {};
    allProducts.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          category: product.category,
          totalSales: 0,
          totalRevenue: 0,
          productCount: 0
        };
      }
      categoryStats[product.category].totalSales += product.salesCount;
      categoryStats[product.category].totalRevenue += product.salesCount * product.price;
      categoryStats[product.category].productCount += 1;
    });

    res.json({
      bestSelling,
      mostViewed,
      categoryStats: Object.values(categoryStats).sort((a, b) => b.totalSales - a.totalSales)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/reports/customers
const getCustomerReport = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    const orders = await Order.find({ status: 'complete' }).populate('userId', 'email profile');

    // Top customers by spending
    const customerSpending = {};
    orders.forEach(order => {
      const userId = order.userId._id.toString();
      if (!customerSpending[userId]) {
        customerSpending[userId] = {
          userId,
          email: order.userId.email,
          name: order.userId.profile?.name || 'Unknown',
          totalSpent: 0,
          orderCount: 0
        };
      }
      customerSpending[userId].totalSpent += order.total;
      customerSpending[userId].orderCount += 1;
    });

    const topCustomers = Object.values(customerSpending)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // New customers per month
    const monthlyNewCustomers = {};
    customers.forEach(customer => {
      const month = new Date(customer.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric'
      });
      monthlyNewCustomers[month] = (monthlyNewCustomers[month] || 0) + 1;
    });

    res.json({
      summary: {
        totalCustomers: customers.length,
        totalOrdersPlaced: orders.length,
        customersWithOrders: Object.keys(customerSpending).length,
        averageOrdersPerCustomer: customers.length > 0
          ? orders.length / customers.length
          : 0
      },
      topCustomers,
      monthlyNewCustomers: Object.entries(monthlyNewCustomers).map(([month, count]) => ({
        month,
        count
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getAllCustomers,
  getFinancialReport,
  getProductReport,
  getCustomerReport
};