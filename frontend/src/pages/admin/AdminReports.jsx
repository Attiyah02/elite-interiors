import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [financial, setFinancial] = useState(null);
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [finRes, prodRes, custRes] = await Promise.all([
          adminAPI.getFinancialReport(),
          adminAPI.getProductReport(),
          adminAPI.getCustomerReport()
        ]);
        setFinancial(finRes.data);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
      } catch (error) {
        console.error('Reports error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner text="Loading reports..." />;

  const tabs = [
    { id: 'financial', label: '💰 Financial' },
    { id: 'products', label: '📦 Products' },
    { id: 'customers', label: '👥 Customers' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-500 mt-1">Business insights and analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-md w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl font-semibold transition ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Financial Report */}
      {activeTab === 'financial' && financial && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: `R ${financial.summary.totalRevenue?.toLocaleString()}`, color: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700' },
              { label: 'Cost of Sales', value: `R ${financial.summary.totalCost?.toLocaleString()}`, color: 'border-l-red-500', bg: 'bg-red-50', text: 'text-red-700' },
              { label: 'Gross Profit', value: `R ${financial.summary.totalProfit?.toLocaleString()}`, color: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
              { label: 'Profit Margin', value: `${financial.summary.profitMargin}%`, color: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${stat.color}`}>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Order Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-bold">{financial.summary.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Order Value</span>
                  <span className="font-bold text-amber-600">
                    R {Math.round(financial.summary.averageOrderValue).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Revenue</span>
                  <span className="font-bold text-green-600">
                    R {financial.summary.totalRevenue?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Payment Methods</h3>
              {financial.paymentBreakdown?.length > 0 ? (
                <div className="space-y-3">
                  {financial.paymentBreakdown.map((p, i) => {
                    const total = financial.summary.totalRevenue || 1;
                    const pct = Math.round((p.amount / total) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{p.method}</span>
                          <span className="text-gray-500">R {p.amount?.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No payment data yet</p>
              )}
            </div>
          </div>

          {/* Monthly Revenue */}
          {financial.monthlyRevenue?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-6">Monthly Revenue</h3>
              <div className="space-y-3">
                {financial.monthlyRevenue.map((m, i) => {
                  const maxRevenue = Math.max(...financial.monthlyRevenue.map(r => r.revenue));
                  const pct = Math.round((m.revenue / maxRevenue) * 100);
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-24 shrink-0">{m.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4">
                        <div
                          className="bg-amber-500 h-4 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-amber-600 w-24 text-right">
                        R {m.revenue?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Report */}
      {activeTab === 'products' && products && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Best Selling */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-6">🏆 Best Selling Products</h3>
              <div className="space-y-4">
                {products.bestSelling?.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-400 text-white' :
                      i === 1 ? 'bg-gray-300 text-white' :
                      i === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{p.salesCount} sold</p>
                      <p className="text-xs text-gray-400">R {p.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Viewed */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-6">👀 Most Viewed Products</h3>
              <div className="space-y-4">
                {products.mostViewed?.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{p.views} views</p>
                      <p className="text-xs text-gray-400">{p.salesCount} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-6">📊 Sales by Category</h3>
            <div className="space-y-4">
              {products.categoryStats?.map((cat, i) => {
                const maxSales = Math.max(...products.categoryStats.map(c => c.totalSales));
                const pct = maxSales > 0 ? Math.round((cat.totalSales / maxSales) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm">{cat.category}</span>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 mr-4">{cat.totalSales} sold</span>
                        <span className="text-sm font-bold text-amber-600">
                          R {cat.totalRevenue?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-amber-500 h-3 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {activeTab === 'customers' && customers && (
        <div className="space-y-6">

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Customers', value: customers.summary.totalCustomers },
              { label: 'Orders Placed', value: customers.summary.totalOrdersPlaced },
              { label: 'Active Customers', value: customers.summary.customersWithOrders },
              { label: 'Avg Orders/Customer', value: Number(customers.summary.averageOrdersPerCustomer).toFixed(1) },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 text-center">
                <p className="text-3xl font-bold text-amber-600">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-6">🏆 Top Customers by Spending</h3>
            {customers.topCustomers?.length > 0 ? (
              <div className="space-y-4">
                {customers.topCustomers.map((customer, i) => (
                  <div key={customer.userId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0 ? 'bg-yellow-400' :
                      i === 1 ? 'bg-gray-400' :
                      i === 2 ? 'bg-amber-600' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{customer.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600 text-lg">
                        R {customer.totalSpent?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{customer.orderCount} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No customer purchase data yet</p>
                <p className="text-sm mt-1">Data will appear after customers place orders</p>
              </div>
            )}
          </div>

          {/* New Customers Per Month */}
          {customers.monthlyNewCustomers?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-6">📈 New Customers Per Month</h3>
              <div className="space-y-3">
                {customers.monthlyNewCustomers.map((m, i) => {
                  const max = Math.max(...customers.monthlyNewCustomers.map(c => c.count));
                  const pct = Math.round((m.count / max) * 100);
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-24 shrink-0">{m.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-600 w-16 text-right">
                        {m.count} new
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReports;