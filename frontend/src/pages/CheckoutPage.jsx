import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Redirect admins away from checkout
  useEffect(() => {
    if (user?.role === 'admin') {
      alert('Admins cannot place orders. Please use a customer account.');
      navigate('/admin');
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod: formData.paymentMethod
      };

      await ordersAPI.create(orderData);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Don't render checkout for admins
  if (user?.role === 'admin') {
    return null;
  }

  return (
    <div style={{ minHeight: '80vh', background: 'var(--warm-white)', padding: '48px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
            Secure Checkout
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
            Complete Your Order
          </h1>
        </div>

        {error && (
          <div style={{ background: '#fdf0f0', border: '1px solid #f5c0c0', padding: '12px 16px', marginBottom: 24, fontSize: '0.85rem', color: '#8a2020' }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: 32 
        }}>
          <style>{`
            @media (min-width: 769px) {
              .checkout-grid {
                grid-template-columns: 1.5fr 1fr !important;
              }
            }
          `}</style>

          <div className="checkout-grid" style={{ display: 'grid', gap: 32 }}>
            {/* Form Section */}
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: 'clamp(20px, 4vw, 32px)', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, marginBottom: 24, color: 'var(--charcoal)' }}>
                Delivery Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                  <style>{`
                    @media (min-width: 640px) {
                      .name-email-grid {
                        grid-template-columns: 1fr 1fr !important;
                      }
                    }
                  `}</style>
                  
                  <div className="name-email-grid" style={{ display: 'grid', gap: 20 }}>
                    <div>
                      <label className="field-label">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="field-input" />
                    </div>

                    <div>
                      <label className="field-label">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="field-input" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="field-label">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="field-input" />
                </div>

                <div>
                  <label className="field-label">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="field-input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                  <style>{`
                    @media (min-width: 640px) {
                      .city-postal-grid {
                        grid-template-columns: 1.5fr 1fr !important;
                      }
                    }
                  `}</style>
                  
                  <div className="city-postal-grid" style={{ display: 'grid', gap: 20 }}>
                    <div>
                      <label className="field-label">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="field-input" />
                    </div>

                    <div>
                      <label className="field-label">Postal Code</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="field-input" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="field-label">Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="field-input">
                    <option value="card">Credit/Debit Card</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 32 }}>
                {loading ? 'Processing...' : `Place Order - R ${total.toLocaleString()}`}
              </button>
            </form>

            {/* Order Summary */}
            <div>
              <div style={{ background: 'white', padding: 'clamp(20px, 4vw, 32px)', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 100 }}>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, marginBottom: 24, color: 'var(--charcoal)' }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  {cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--stone-100)' }}>
                      <img 
                        src={item.images?.[0] || 'https://via.placeholder.com/80'} 
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: 'contain', background: 'var(--stone-50)', borderRadius: 2, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--stone-600)' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--charcoal)', flexShrink: 0 }}>
                        R {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ paddingTop: 16, borderTop: '2px solid var(--stone-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--stone-600)' }}>Subtotal</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>R {total.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--stone-600)' }}>Delivery</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--accent)' }}>
                      {total >= 2000 ? 'Free' : 'R 150'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--stone-200)' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>Total</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>
                      R {(total + (total >= 2000 ? 0 : 150)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {total >= 2000 && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#e8f5e9', borderRadius: 4, fontSize: '0.8rem', color: '#2e7d32' }}>
                    ✓ You qualify for free white glove delivery!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;