import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentMethod = paymentFilter;
      const res = await adminAPI.getOrders(params);
      setOrders(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.userId?.profile?.name || order.userId?.email || '';
    return customerName.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Payment Methods</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Completed', value: orders.filter(o => o.status === 'complete').length, color: 'bg-green-50 text-green-700' },
          { label: 'Total Revenue', value: `R ${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, color: 'bg-amber-50 text-amber-700' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Items</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Payment</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 text-sm">
                      {order.userId?.profile?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">{order.userId?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-600">
                    R {order.total?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'complete'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-amber-600 hover:text-amber-700 text-sm font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">
                Order #{selectedOrder._id.slice(-6).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-semibold">{selectedOrder.userId?.profile?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.userId?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-semibold capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedOrder.status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3">Items</h3>
              <div className="space-y-3 mb-6">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-amber-600">
                      R {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl text-amber-600">
                  R {selectedOrder.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;