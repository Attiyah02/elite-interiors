import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
        <ShoppingBag size={64} style={{ color: 'var(--stone-300)', margin: '0 auto 24px' }} />
        <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--stone-600)', marginBottom: 32, fontFamily: 'Jost, sans-serif' }}>
          Discover pieces that speak to you
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          Shopping Cart
        </span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
          {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 48 }}>

        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cart.map(item => {
            const itemPrice = item.price * (1 - (item.discount || 0) / 100);
            return (
              <article key={item._id} style={{ 
                background: 'white', 
                border: '1px solid var(--stone-200)', 
                padding: 20,
                display: 'flex', gap: 20
              }}>
                
                {/* Image */}
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  background: 'var(--stone-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'}
                    alt={item.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      padding: '8px'
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif' }}>
                      {item.category}
                    </span>
                    <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--charcoal)', marginTop: 4, marginBottom: 4 }}>
                      {item.name}
                    </h3>
                    {item.selectedColor && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                        Color: {item.selectedColor}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--stone-200)' }}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '8px 14px', fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', fontWeight: 500, borderLeft: '1px solid var(--stone-200)', borderRight: '1px solid var(--stone-200)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p className="font-display" style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                          R {(itemPrice * item.quantity).toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif' }}>
                          R {itemPrice.toLocaleString()} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-400)', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.target.style.color = '#c04040'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--stone-400)'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            onClick={clearCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif', alignSelf: 'flex-start', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#c04040'}
            onMouseLeave={(e) => e.target.style.color = 'var(--stone-400)'}
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <div style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 28, position: 'sticky', top: 100 }}>
            
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 24 }}>
              Order Summary
            </h2>

            <div style={{ borderTop: '1px solid var(--stone-200)', borderBottom: '1px solid var(--stone-200)', padding: '20px 0', marginBottom: 20 }}>
              {cart.map(item => {
                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                return (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem', fontFamily: 'Jost, sans-serif' }}>
                    <span style={{ color: 'var(--stone-600)' }}>
                      {item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>
                      R {(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                Total
              </span>
              <span className="font-display" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                R {cartTotal.toLocaleString()}
              </span>
            </div>

            {cartTotal >= 2000 && (
              <div style={{ background: 'var(--stone-100)', padding: '12px 16px', marginBottom: 20, fontSize: '0.75rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif', textAlign: 'center' }}>
                ✓ Qualifies for complimentary delivery
              </div>
            )}

            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
              {isLoggedIn ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              <ArrowRight size={16} />
            </button>

            <button onClick={() => navigate('/products')} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;