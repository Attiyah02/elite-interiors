import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Wallet, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../utils/api';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
    { id: 'cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
    { id: 'paypal', label: 'PayPal', icon: Wallet, desc: 'Secure payment via PayPal' },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      await ordersAPI.create({
        items: orderItems,
        paymentMethod
      });

      clearCart();
      setSuccess(true);

      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }} className="animate-fade-up">
          <CheckCircle size={64} style={{ color: '#2d7a4f', margin: '0 auto 20px' }} />
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
            Order Confirmed
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--stone-600)', marginBottom: 4, fontFamily: 'Jost, sans-serif' }}>
            Thank you for your purchase
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif' }}>
            Redirecting to your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          Checkout
        </span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
          Complete Your Order
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 48 }}>

        {/* Payment Method Selection */}
        <div>
          <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 24 }}>
            Payment Method
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <label
                  key={method.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: 20, background: 'white',
                    border: `1px solid ${isSelected ? 'var(--charcoal)' : 'var(--stone-200)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--stone-400)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--stone-200)';
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={isSelected}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div style={{ 
                    width: 48, height: 48, 
                    background: isSelected ? 'var(--charcoal)' : 'var(--stone-100)',
                    color: isSelected ? 'white' : 'var(--stone-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>
                      {method.label}
                    </p>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: 'var(--stone-600)' }}>
                      {method.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle size={20} style={{ color: 'var(--charcoal)' }} />
                  )}
                </label>
              );
            })}
          </div>

          {/* Simulated Card Details */}
          {paymentMethod === 'card' && (
            <div style={{ marginTop: 24, background: 'var(--stone-100)', padding: 24, border: '1px solid var(--stone-200)' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-600)', marginBottom: 16, fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                Card Details (Simulation)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  type="text"
                  placeholder="Card Number: 4242 4242 4242 4242"
                  className="box-input"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input
                    type="text"
                    placeholder="MM/YY: 12/28"
                    className="box-input"
                  />
                  <input
                    type="text"
                    placeholder="CVV: 123"
                    className="box-input"
                  />
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--stone-500)', marginTop: 12, fontFamily: 'Jost, sans-serif' }}>
                * This is a simulation - no real payment will be processed
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 28, position: 'sticky', top: 100 }}>
            
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 24 }}>
              Order Summary
            </h2>

            <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 20 }}>
              {cart.map(item => {
                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                return (
                  <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ 
                      width: 60, 
                      height: 60, 
                      background: 'var(--stone-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100'}
                        alt={item.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          padding: '4px'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontFamily: 'Jost, sans-serif', fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2, lineHeight: 1.3 }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-display" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                      R {(itemPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--stone-200)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                  Total
                </span>
                <span className="font-display" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                  R {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fdf0f0', border: '1px solid #f5c0c0', borderRadius: 0, padding: '12px 16px', marginBottom: 20, fontSize: '0.8rem', color: '#8a2020', fontFamily: 'Jost, sans-serif' }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              {loading ? (
                'Processing...'
              ) : (
                `Place Order • R ${cartTotal.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;