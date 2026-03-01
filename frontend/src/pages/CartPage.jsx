import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2 } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '48px 32px',
        background: 'var(--warm-white)'
      }}>
        <ShoppingBag size={64} strokeWidth={1} style={{ color: 'var(--stone-300)', marginBottom: 24 }} />
        <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 12 }}>
          Your Cart is Empty
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--stone-600)', marginBottom: 32, textAlign: 'center' }}>
          Discover our curated collection of premium furniture
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

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
            Shopping Cart
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <h1 className="font-display" style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
              fontWeight: 400, 
              color: 'var(--charcoal)', 
              marginTop: 8 
            }}>
              Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h1>
            <button 
              onClick={clearCart}
              style={{ 
                background: 'none', 
                border: '1px solid var(--stone-300)', 
                padding: '8px 16px', 
                cursor: 'pointer',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--stone-600)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--stone-300)';
                e.target.style.color = 'var(--stone-600)';
              }}
            >
              <Trash2 size={14} />
              Clear Cart
            </button>
          </div>
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
              gap: 12px !important;
            }
            
            .cart-item-actions {
              grid-column: 1 / -1 !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              padding-top: 12px !important;
              border-top: 1px solid var(--stone-100) !important;
              margin-top: 8px !important;
            }
            
            .quantity-controls {
              gap: 8px !important;
            }
            
            .quantity-btn {
              width: 28px !important;
              height: 28px !important;
              font-size: 0.9rem !important;
            }
          }

          @media (max-width: 480px) {
            .cart-item {
              grid-template-columns: 60px 1fr !important;
            }
          }
        `}</style>

        <div className="cart-layout" style={{ display: 'grid', gap: 32 }}>
          {/* Cart Items */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: 'clamp(20px, 4vw, 32px)', 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)' 
            }}>
              {cart.map((item, index) => (
                <div 
                  key={item._id} 
                  className="cart-item"
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto',
                    gap: 16,
                    padding: '20px 0',
                    borderBottom: index < cart.length - 1 ? '1px solid var(--stone-200)' : 'none'
                  }}
                >
                  {/* Product Image */}
                  <img 
                    src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                    alt={item.name}
                    style={{ 
                      width: '100%', 
                      aspectRatio: '1', 
                      objectFit: 'contain', 
                      background: 'var(--stone-50)', 
                      padding: 12,
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
                        marginBottom: 8,
                        color: 'var(--charcoal)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                      onClick={() => navigate(`/products/${item._id}`)}
                    >
                      {item.name}
                    </h3>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
                      color: 'var(--stone-600)', 
                      marginBottom: 8 
                    }}>
                      {item.category}
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', 
                      fontWeight: 600, 
                      color: 'var(--accent)' 
                    }}>
                      R {item.price.toLocaleString()}
                      {item.quantity > 1 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--stone-500)', fontWeight: 400, marginLeft: 8 }}>
                          × {item.quantity}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="cart-item-actions">
                    {/* Quantity Controls */}
                    <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-btn"
                        style={{ 
                          width: 32, 
                          height: 32, 
                          border: '1px solid var(--stone-300)', 
                          background: 'white', 
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          color: 'var(--charcoal)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = 'var(--accent)';
                          e.target.style.background = 'var(--stone-50)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = 'var(--stone-300)';
                          e.target.style.background = 'white';
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
                        fontWeight: 500, 
                        minWidth: 30, 
                        textAlign: 'center',
                        fontFamily: 'Jost, sans-serif'
                      }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                        style={{ 
                          width: 32, 
                          height: 32, 
                          border: '1px solid var(--stone-300)', 
                          background: 'white', 
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          color: 'var(--charcoal)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = 'var(--accent)';
                          e.target.style.background = 'var(--stone-50)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = 'var(--stone-300)';
                          e.target.style.background = 'white';
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      style={{ 
                        color: 'var(--stone-500)', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                        padding: '8px 12px',
                        transition: 'color 0.2s',
                        fontFamily: 'Jost, sans-serif',
                        letterSpacing: '0.02em'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#d32f2f'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--stone-500)'}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button - Mobile */}
            <button 
              onClick={() => navigate('/products')}
              style={{ 
                width: '100%',
                marginTop: 16,
                background: 'none', 
                border: '1px solid var(--stone-300)', 
                padding: '14px', 
                cursor: 'pointer',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--charcoal)',
                transition: 'all 0.2s',
                fontFamily: 'Jost, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--stone-300)';
                e.target.style.color = 'var(--charcoal)';
              }}
            >
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: 'clamp(24px, 4vw, 32px)', 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 100
            }}>
              <h2 style={{ 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                fontWeight: 400, 
                marginBottom: 24, 
                color: 'var(--charcoal)',
                fontFamily: 'Playfair Display, serif'
              }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: 24 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 12,
                  fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
                }}>
                  <span style={{ color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                    Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                  </span>
                  <span style={{ fontWeight: 500, fontFamily: 'Jost, sans-serif' }}>
                    R {subtotal.toLocaleString()}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 12,
                  fontSize: 'clamp(0.85rem, 2vw, 0.9rem)'
                }}>
                  <span style={{ color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                    Delivery
                  </span>
                  <span style={{ 
                    fontWeight: 500, 
                    color: delivery === 0 ? 'var(--accent)' : 'var(--charcoal)',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    {delivery === 0 ? 'Free' : `R ${delivery}`}
                  </span>
                </div>

                {subtotal >= 2000 && (
                  <div style={{ 
                    marginTop: 16, 
                    padding: '12px 16px', 
                    background: '#e8f5e9', 
                    borderRadius: 4, 
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
                    color: '#2e7d32',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    ✓ You qualify for free white glove delivery!
                  </div>
                )}

                {subtotal < 2000 && (
                  <div style={{ 
                    marginTop: 16, 
                    padding: '12px 16px', 
                    background: 'var(--stone-50)', 
                    borderRadius: 4, 
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
                    color: 'var(--stone-600)',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    Add R {(2000 - subtotal).toLocaleString()} more for free delivery
                  </div>
                )}
              </div>

              <div style={{ 
                paddingTop: 20, 
                borderTop: '2px solid var(--stone-200)', 
                marginBottom: 24 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ 
                    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', 
                    fontWeight: 500,
                    fontFamily: 'Jost, sans-serif'
                  }}>
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
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-primary" 
                style={{ width: '100%', marginBottom: 12 }}
              >
                Proceed to Checkout
              </button>

              <p style={{ 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                color: 'var(--stone-500)', 
                textAlign: 'center',
                fontFamily: 'Jost, sans-serif',
                lineHeight: 1.5
              }}>
                Secure checkout • Free returns • 2-year warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;