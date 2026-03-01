import { useState, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const res = await adminAPI.getOrders({});
      setOrders(res.data.orders || []);
      setFilteredOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search
    if (search) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // This would need an API endpoint
      alert(`Update order ${orderId} to ${newStatus} - API endpoint needed`);
      // After successful update:
      // fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const exportOrders = () => {
    // Convert orders to CSV
    const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status'];
    const rows = filteredOrders.map(order => [
      order._id.slice(-8),
      order.userId?.email || 'N/A',
      new Date(order.createdAt).toLocaleDateString(),
      `R ${(order.total || order.totalAmount || 0).toLocaleString()}`,
      order.paymentMethod,
      order.status
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ padding: 'clamp(32px, 5vw, 48px)' }}>
        <p style={{ textAlign: 'center', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: 400,
          color: 'var(--charcoal)',
          marginBottom: 8
        }}>
          Orders
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
          color: 'var(--stone-600)',
          fontFamily: 'Jost, sans-serif'
        }}>
          {filteredOrders.length} orders found
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex',
        gap: 16,
        marginBottom: 32,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--stone-400)'
            }}
          />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid var(--stone-200)',
              fontSize: '0.9rem',
              fontFamily: 'Jost, sans-serif',
              borderRadius: 2
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid var(--stone-200)',
            fontSize: '0.9rem',
            fontFamily: 'Jost, sans-serif',
            borderRadius: 2,
            cursor: 'pointer',
            minWidth: 150
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="complete">Complete</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Export Button */}
        <button
          onClick={exportOrders}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            background: 'white',
            border: '1px solid var(--stone-300)',
            color: 'var(--charcoal)',
            fontSize: '0.85rem',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--stone-50)';
            e.target.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.borderColor = 'var(--stone-300)';
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Orders Table */}
      <div style={{ background: 'white', border: '1px solid var(--stone-200)', borderRadius: 2, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ background: 'var(--stone-50)' }}>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Order ID
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Customer
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Date
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Payment
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Status
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr 
                key={order._id}
                style={{ borderBottom: '1px solid var(--stone-100)' }}
              >
                <td style={{ 
                  padding: '20px 24px',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--charcoal)',
                  fontWeight: 500
                }}>
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td style={{ 
                  padding: '20px 24px'
                }}>
                  <div>
                    <p style={{ 
                      fontSize: '0.85rem',
                      color: 'var(--charcoal)',
                      fontFamily: 'Jost, sans-serif',
                      marginBottom: 2
                    }}>
                      {order.userId?.name || order.userId?.profile?.name || 'N/A'}
                    </p>
                    <p style={{ 
                      fontSize: '0.75rem',
                      color: 'var(--stone-500)',
                      fontFamily: 'Jost, sans-serif'
                    }}>
                      {order.userId?.email || 'N/A'}
                    </p>
                  </div>
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  fontSize: '0.85rem',
                  color: 'var(--stone-600)',
                  fontFamily: 'Jost, sans-serif',
                  whiteSpace: 'nowrap'
                }}>
                  {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  fontSize: '0.85rem',
                  color: 'var(--stone-600)',
                  fontFamily: 'Jost, sans-serif',
                  textTransform: 'capitalize'
                }}>
                  {order.paymentMethod}
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontFamily: 'Jost, sans-serif',
                  whiteSpace: 'nowrap'
                }}>
                  R {(order.total || order.totalAmount || 0).toLocaleString()}
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'center'
                }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 12,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      fontFamily: 'Jost, sans-serif',
                      textTransform: 'capitalize',
                      border: '1px solid var(--stone-200)',
                      background: order.status === 'complete' ? '#e8f5e9' : 
                                 order.status === 'cancelled' ? '#fdf0f0' : 
                                 'var(--stone-100)',
                      color: order.status === 'complete' ? '#2e7d32' : 
                             order.status === 'cancelled' ? '#d32f2f' : 
                             'var(--stone-700)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="complete">Complete</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'center'
                }}>
                  <button
                    onClick={() => alert(`View order details - Order ID: ${order._id}`)}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--stone-100)',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 2,
                      fontSize: '0.8rem',
                      fontFamily: 'Jost, sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--accent)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--stone-100)';
                      e.target.style.color = 'var(--charcoal)';
                    }}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ 
              color: 'var(--stone-500)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.9rem'
            }}>
              No orders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;