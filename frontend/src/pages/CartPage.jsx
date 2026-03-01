import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--warm-white)',
        padding: '48px 32px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <ShoppingBag size={64} strokeWidth={1} style={{ color: 'var(--stone-300)', marginBottom: 24 }} />
          <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 12 }}>
            Your Cart is Empty
          </h2>
          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: 'var(--stone-600)', marginBottom: 32, fontFamily: 'Jost, sans-serif' }}>
            Start adding pieces to create your perfect space
          </p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: 'var(--warm-white)', padding: 'clamp(32px, 5vw, 48px) 0' }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
            Shopping Cart
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
            Your Selected Pieces
          </h1>
          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', color: 'var(--stone-600)', marginTop: 8, fontFamily: 'Jost, sans-serif' }}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
          </p>
        </div>

        <style>{`
          @media (min-width: 769px) {
            .cart-layout {
              grid-template-columns: 1.5fr 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .cart-item {
              grid-template-columns: 70px 1fr !important;
            }
            
            .cart-item-actions {
              grid-column: 1 / -1 !important;
            }

            .quantity-controls button {
              width: 32px !important;
              height: 32px !important;
              padding: 0 !important;
            }

            .quantity-controls span {
              min-width: 40px !important;
              font-size: 0.85rem !important;
            }
          }
        `}</style>

        <div className="cart-layout" style={{ display: 'grid', gap: 32 }}>
          {/* Cart Items */}
          <div>
            <div style={{ background: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              {cart.map((item, index) => (
                <div 
                  key={item._id}
                  className="cart-item"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto',
                    gap: 'clamp(12px, 3vw, 20px)',
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderBottom: index < cart.length - 1 ? '1px solid var(--stone-100)' : 'none',
                    alignItems: 'start'
                  }}
                >
                  {/* Image */}
                  <img 
                    src={item.selectedImage || item.images?.[0] || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    style={{ 
                      width: '100%',
                      aspectRatio: '1',
                      objectFit: 'contain',
                      background: 'var(--stone-50)',
                      padding: 'clamp(6px, 1.5vw, 8px)',
                      borderRadius: 2,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/products/${item._id}`)}
                  />

                  {/* Product Info */}
                  <div style={{ minWidth: 0 }}>
                    <h3 
                      style={{ 
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                        fontWeight: 500,
                        color: 'var(--charcoal)',
                        marginBottom: 6,
                        fontFamily: 'Jost, sans-serif',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => navigate(`/products/${item._id}`)}
                    >
                      {item.name}
                    </h3>
                    
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
                      color: 'var(--stone-500)',
                      marginBottom: 8,
                      fontFamily: 'Jost, sans-serif'
                    }}>
                      {item.category} • {item.subcategory}
                    </p>

                    {item.selectedColor && (
                      <p style={{ 
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                        color: 'var(--stone-600)',
                        fontFamily: 'Jost, sans-serif'
                      }}>
                        Color: {item.selectedColor}
                      </p>
                    )}

                    <p style={{ 
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      marginTop: 12,
                      fontFamily: 'Jost, sans-serif'
                    }}>
                      R {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls & Remove - Desktop */}
                  <div className="cart-item-actions" style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    alignItems: 'flex-end'
                  }}>
                    <div className="quantity-controls" style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--stone-200)',
                      borderRadius: 2
                    }}>
                      <button
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--charcoal)',
                          width: 36,
                          height: 36
                        }}
                      >
                        <Minus size={14} />
                      </button>

                      <span style={{ 
                        padding: '0 12px',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        minWidth: 50,
                        textAlign: 'center',
                        borderLeft: '1px solid var(--stone-200)',
                        borderRight: '1px solid var(--stone-200)',
                        color: 'var(--charcoal)'
                      }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--charcoal)',
                          width: 36,
                          height: 36
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#d32f2f',
                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                        fontFamily: 'Jost, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 8px',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: 'clamp(20px, 4vw, 32px)', 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 100
            }}>
              <h2 style={{ 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 400,
                color: 'var(--charcoal)',
                marginBottom: 24,
                fontFamily: 'Playfair Display, serif'
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 500, fontFamily: 'Jost, sans-serif' }}>
                    R {subtotal.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                    Delivery
                  </span>
                  <span style={{ 
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
                    fontWeight: 500,
                    color: deliveryFee === 0 ? 'var(--accent)' : 'inherit',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    {deliveryFee === 0 ? 'Free' : `R ${deliveryFee}`}
                  </span>
                </div>
              </div>

              <div style={{ 
                paddingTop: 20,
                marginBottom: 24,
                borderTop: '2px solid var(--stone-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', fontWeight: 500, fontFamily: 'Jost, sans-serif' }}>
                  Total
                </span>
                <span style={{ 
                  fontSize: 'clamp(1.3rem, 3vw, 1.5rem)',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  R {total.toLocaleString()}
                </span>
              </div>

              {subtotal >= 2000 && (
                <div style={{ 
                  marginBottom: 20,
                  padding: '12px 16px',
                  background: '#e8f5e9',
                  borderRadius: 4,
                  fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                  color: '#2e7d32',
                  fontFamily: 'Jost, sans-serif',
                  lineHeight: 1.5
                }}>
                  ✓ You qualify for free white glove delivery!
                </div>
              )}

              {/* Checkout Button - Hide for Admins */}
              {user?.role !== 'admin' ? (
                <button 
                  onClick={() => navigate('/checkout')}
                  className="btn-primary" 
                  style={{ width: '100%', marginBottom: 12 }}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div style={{
                  padding: '16px',
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: 4,
                  marginBottom: 12,
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                    color: '#856404',
                    fontFamily: 'Jost, sans-serif',
                    lineHeight: 1.5
                  }}>
                    ℹ️ Admins cannot place orders. Use a customer account to checkout.
                  </p>
                </div>
              )}

              <button 
                onClick={() => navigate('/products')}
                className="btn-outline"
                style={{ width: '100%' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;