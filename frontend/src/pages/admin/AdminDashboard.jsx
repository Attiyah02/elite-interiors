import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowRight } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    avgOrderValue: 0,
    profit: 0,
    margin: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const [financialRes, ordersRes, customersRes] = await Promise.all([
      adminAPI.getFinancialReport(),
      adminAPI.getOrders({ limit: 5 }),
      adminAPI.getCustomers()
    ]);

    console.log('📊 Financial Response:', financialRes.data);
    console.log('📦 Orders Response:', ordersRes.data);
    console.log('👥 Customers Response:', customersRes.data);

    // Backend returns {summary: {...}, monthlyRevenue: [...], paymentBreakdown: [...]}
    const financial = financialRes.data.summary || financialRes.data;
    
    setStats({
      revenue: financial.totalRevenue || 0,
      orders: financial.totalOrders || 0,
      customers: customersRes.data.length || 0,
      avgOrderValue: financial.averageOrderValue || 0,
      profit: financial.totalProfit || 0,
      margin: parseFloat(financial.profitMargin) || 0
    });

    // Backend returns orders as direct array, not {orders: [...]}
    const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : [];
    setRecentOrders(ordersData);
    
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    console.error('❌ Error response:', error.response?.data);
  } finally {
    setLoading(false);
  }
};

  const statCards = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `R ${stats.revenue.toLocaleString()}`,
      color: '#C9A96E'
    },
    {
      icon: TrendingUp,
      label: 'Total Profit',
      value: `R ${stats.profit.toLocaleString()}`,
      subtitle: `${stats.margin}% margin`,
      color: '#4caf50'
    },
    {
      icon: Users,
      label: 'Total Customers',
      value: stats.customers,
      subtitle: `${stats.orders} orders placed`,
      color: '#2196f3'
    },
    {
      icon: ShoppingBag,
      label: 'Avg Order Value',
      value: `R ${stats.avgOrderValue.toLocaleString()}`,
      subtitle: 'per order',
      color: '#ff9800'
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: 'clamp(32px, 5vw, 48px)' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: 400, 
          color: 'var(--charcoal)',
          marginBottom: 8
        }}>
          Dashboard
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
          color: 'var(--stone-600)',
          fontFamily: 'Jost, sans-serif'
        }}>
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr))',
        gap: 'clamp(16px, 3vw, 24px)',
        marginBottom: 48
      }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: 'clamp(20px, 4vw, 32px)',
                borderRadius: 2,
                border: '1px solid var(--stone-200)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>

              <p style={{ 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                color: 'var(--stone-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
                fontFamily: 'Jost, sans-serif',
                fontWeight: 500
              }}>
                {stat.label}
              </p>

              <p className="font-display" style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 600,
                color: 'var(--charcoal)',
                marginBottom: 4
              }}>
                {stat.value}
              </p>

              {stat.subtitle && (
                <p style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
                  color: 'var(--stone-600)',
                  fontFamily: 'Jost, sans-serif'
                }}>
                  {stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', border: '1px solid var(--stone-200)', borderRadius: 2 }}>
        <div style={{ 
          padding: 'clamp(20px, 4vw, 32px)',
          borderBottom: '1px solid var(--stone-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <h2 className="font-display" style={{ 
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
            fontWeight: 400,
            color: 'var(--charcoal)'
          }}>
            Recent Orders
          </h2>
          <Link 
            to="/admin/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--accent)',
              textDecoration: 'none',
              fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
              fontFamily: 'Jost, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.02em'
            }}
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {recentOrders.length === 0 ? (
            <div style={{ padding: 'clamp(40px, 8vw, 60px)', textAlign: 'center' }}>
              <p style={{ 
                color: 'var(--stone-500)', 
                fontFamily: 'Jost, sans-serif',
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
              }}>
                No orders yet
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--stone-50)' }}>
                  <th style={{ 
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--stone-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    Order ID
                  </th>
                  <th style={{ 
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--stone-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    Customer
                  </th>
                  <th style={{ 
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--stone-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    Date
                  </th>
                  <th style={{ 
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--stone-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    Total
                  </th>
                  <th style={{ 
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--stone-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Jost, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr 
                    key={order._id}
                    style={{ borderBottom: '1px solid var(--stone-100)' }}
                  >
                    <td style={{ 
                      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 32px)',
                      fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                      color: 'var(--charcoal)',
                      fontFamily: 'monospace'
                    }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ 
                      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 32px)',
                      fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                      color: 'var(--charcoal)',
                      fontFamily: 'Jost, sans-serif'
                    }}>
                      {order.userId?.email || order.userId?.name || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 32px)',
                      fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                      color: 'var(--stone-600)',
                      fontFamily: 'Jost, sans-serif',
                      whiteSpace: 'nowrap'
                    }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ 
                      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 32px)',
                      fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'Jost, sans-serif',
                      whiteSpace: 'nowrap'
                    }}>
                      R {(order.total || order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 32px)'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                        fontWeight: 500,
                        fontFamily: 'Jost, sans-serif',
                        textTransform: 'capitalize',
                        background: order.status === 'complete' ? '#e8f5e9' : 'var(--stone-100)',
                        color: order.status === 'complete' ? '#2e7d32' : 'var(--stone-600)',
                        whiteSpace: 'nowrap'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;