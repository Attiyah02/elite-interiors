import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Users, Package,
  TrendingUp, ArrowRight, DollarSign
} from 'lucide-react';
import { adminAPI, productsAPI } from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [financials, setFinancials] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [customerReport, setCustomerReport] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [finRes, prodRes, custRes, ordersRes] = await Promise.all([
          adminAPI.getFinancialReport(),
          adminAPI.getProductReport(),
          adminAPI.getCustomerReport(),
          adminAPI.getOrders()
        ]);
        setFinancials(finRes.data);
        setProductReport(prodRes.data);
        setCustomerReport(custRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const stats = [
    {
      label: 'Total Revenue',
      value: `R ${financials?.summary?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-green-500',
      sub: `${financials?.summary?.totalOrders || 0} orders`
    },
    {
      label: 'Total Profit',
      value: `R ${financials?.summary?.totalProfit?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      sub: `${financials?.summary?.profitMargin || 0}% margin`
    },
    {
      label: 'Total Customers',
      value: customerReport?.summary?.totalCustomers || 0,
      icon: Users,
      color: 'bg-blue-500',
      sub: `${customerReport?.summary?.totalOrdersPlaced || 0} orders placed`
    },
    {
      label: 'Avg Order Value',
      value: `R ${Math.round(financials?.summary?.averageOrderValue || 0).toLocaleString()}`,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      sub: 'per order'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Best Selling Products</h2>
            <Link to="/admin/reports" className="text-amber-600 text-sm flex items-center gap-1">
              View Report <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {productReport?.bestSelling?.slice(0, 5).map((product, i) => (
              <div key={product._id} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">{product.salesCount} sold</p>
                  <p className="text-xs text-gray-400">R {product.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Top Customers</h2>
            <Link to="/admin/reports" className="text-amber-600 text-sm flex items-center gap-1">
              View Report <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {customerReport?.topCustomers?.slice(0, 5).map((customer, i) => (
              <div key={customer.userId} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-amber-600 font-bold text-sm">
                    {customer.name?.[0] || customer.email?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {customer.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">
                    R {customer.totalSpent?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{customer.orderCount} orders</p>
                </div>
              </div>
            ))}
            {(!customerReport?.topCustomers || customerReport.topCustomers.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">No customer data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-amber-600 text-sm flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Payment</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-mono text-sm text-gray-600">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 text-sm text-gray-800">
                    {order.userId?.profile?.name || order.userId?.email || 'Unknown'}
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="py-3 text-sm capitalize text-gray-600">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3 font-bold text-amber-600">
                    R {order.total?.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'complete'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;