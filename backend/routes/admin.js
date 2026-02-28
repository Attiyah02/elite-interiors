const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getAllCustomers,
  getFinancialReport,
  getProductReport,
  getCustomerReport
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes are protected
router.use(protect, adminOnly);

router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);
router.get('/reports/financial', getFinancialReport);
router.get('/reports/products', getProductReport);
router.get('/reports/customers', getCustomerReport);

module.exports = router;