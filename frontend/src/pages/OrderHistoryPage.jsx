import { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders().then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching orders:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
        <Package size={64} style={{ color: 'var(--stone-300)', margin: '0 auto 24px' }} />
        <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
          No orders yet
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
          Your order history will appear here
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          Account
        </span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
          Order History
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--stone-600)', marginTop: 8, fontFamily: 'Jost, sans-serif' }}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {orders.map(order => (
          <article key={order._id} style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 28 }}>
            
            {/* Order Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--stone-100)' }}>
              <div style={{ display: 'flex', gap: 32 }}>
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone-500)', marginBottom: 4, fontFamily: 'Jost, sans-serif' }}>
                    Order ID
                  </p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone-500)', marginBottom: 4, fontFamily: 'Jost, sans-serif' }}>
                    Date Placed
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone-500)', marginBottom: 4, fontFamily: 'Jost, sans-serif' }}>
                    Payment Method
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif', fontWeight: 500, textTransform: 'capitalize' }}>
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
              <div>
                {order.status === 'complete' ? (
                  <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={12} />
                    Complete
                  </div>
                ) : (
                  <div className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} />
                    Pending
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, background: 'var(--stone-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={24} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontFamily: 'Jost, sans-serif', fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-display" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                    R {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div style={{ borderTop: '1px solid var(--stone-100)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                Order Total
              </span>
              <span className="font-display" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                R {order.total.toLocaleString()}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;