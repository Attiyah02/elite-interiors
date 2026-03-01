import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Calendar } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getMyOrders();
        console.log('📦 Orders:', res.data);
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your orders..." />;

  return (
    <div style={{ minHeight: '80vh', background: 'var(--warm-white)', padding: 'clamp(32px, 5vw, 48px) 0' }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span style={{ 
            fontSize: '0.65rem', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            color: 'var(--accent)', 
            fontFamily: 'Jost, sans-serif', 
            fontWeight: 500 
          }}>
            Order History
          </span>
          <h1 className="font-display" style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontWeight: 400, 
            color: 'var(--charcoal)', 
            marginTop: 8 
          }}>
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'clamp(60px, 10vw, 100px) 20px',
            background: 'white',
            borderRadius: 2,
            border: '1px solid var(--stone-200)'
          }}>
            <Package size={64} strokeWidth={1} style={{ color: 'var(--stone-300)', marginBottom: 24 }} />
            <h2 className="font-display" style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
              fontWeight: 400, 
              color: 'var(--charcoal)', 
              marginBottom: 12 
            }}>
              No Orders Yet
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
              color: 'var(--stone-600)', 
              marginBottom: 32,
              fontFamily: 'Jost, sans-serif'
            }}>
              Start shopping to see your orders here
            </p>
            <button 
              onClick={() => navigate('/products')} 
              className="btn-primary"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {orders.map((order) => (
              <div 
                key={order._id}
                style={{
                  background: 'white',
                  border: '1px solid var(--stone-200)',
                  padding: 'clamp(20px, 4vw, 32px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => navigate(`/orders/${order._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--stone-200)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 16
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3 style={{ 
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', 
                        fontWeight: 500, 
                        fontFamily: 'Jost, sans-serif',
                        color: 'var(--charcoal)'
                      }}>
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <span style={{
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        background: order.status === 'complete' ? '#e8f5e9' : 'var(--stone-100)',
                        color: order.status === 'complete' ? '#2e7d32' : 'var(--stone-600)',
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: 500
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--stone-600)' }}>
                      <Calendar size={14} />
                      <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontFamily: 'Jost, sans-serif' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                      color: 'var(--stone-500)', 
                      marginBottom: 4,
                      fontFamily: 'Jost, sans-serif'
                    }}>
                      Total
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                      fontWeight: 600, 
                      color: 'var(--accent)',
                      fontFamily: 'Playfair Display, serif'
                    }}>
                      R {(order.total || order.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ 
                  borderTop: '1px solid var(--stone-100)', 
                  paddingTop: 20,
                  marginBottom: 16
                }}>
                  <p style={{ 
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                    color: 'var(--stone-500)', 
                    marginBottom: 12,
                    fontFamily: 'Jost, sans-serif',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}>
                    Items ({order.items?.length || 0})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {item.productId?.images?.[0] && (
                          <img 
                            src={item.productId.images[0]} 
                            alt={item.productId?.name || item.name}
                            style={{ 
                              width: 50, 
                              height: 50, 
                              objectFit: 'contain', 
                              background: 'var(--stone-50)',
                              padding: 4,
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', 
                            fontWeight: 500,
                            color: 'var(--charcoal)',
                            fontFamily: 'Jost, sans-serif',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.productId?.name || item.name}
                          </p>
                          <p style={{ 
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                            color: 'var(--stone-500)',
                            fontFamily: 'Jost, sans-serif'
                          }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p style={{ 
                          fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', 
                          fontWeight: 500,
                          color: 'var(--charcoal)',
                          fontFamily: 'Jost, sans-serif',
                          flexShrink: 0
                        }}>
                          R {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)', 
                        color: 'var(--stone-500)',
                        fontFamily: 'Jost, sans-serif',
                        fontStyle: 'italic'
                      }}>
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* View Details */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  gap: 6,
                  color: 'var(--accent)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  fontFamily: 'Jost, sans-serif',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  View Details
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;