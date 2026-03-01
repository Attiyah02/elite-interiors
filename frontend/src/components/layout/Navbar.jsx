import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { cart } = useCart();
  const { isLoggedIn, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { name: 'Living Room', path: '/products?category=Living Room' },
    { name: 'Bedroom', path: '/products?category=Bedroom' },
    { name: 'Office', path: '/products?category=Office' },
    { name: 'Dining', path: '/products?category=Dining' },
    { name: 'Storage', path: '/products?category=Storage' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('?category=')) {
      const category = path.split('=')[1];
      return location.search.includes(category);
    }
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  return (
    <nav style={{ 
      background: 'var(--warm-white)', 
      borderBottom: '1px solid var(--stone-200)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Top Bar */}
      <div style={{ 
        maxWidth: 1280, 
        margin: '0 auto', 
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="font-display" style={{ 
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
            fontWeight: 400, 
            color: 'var(--charcoal)',
            letterSpacing: '0.02em',
            margin: 0
          }}>
            Elite Interiors
          </h1>
        </Link>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div style={{ 
          display: 'none',
          gap: 32,
          alignItems: 'center'
        }} className="desktop-nav">
          {/* Home Link */}
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: isActive('/') ? 'var(--charcoal)' : 'var(--stone-600)',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: 'Jost, sans-serif',
              fontWeight: isActive('/') ? 500 : 400,
              borderBottom: isActive('/') ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: 4,
              transition: 'all 0.2s'
            }}
          >
            <Home size={16} />
            Home
          </Link>

          {/* Category Links */}
          {categories.map(cat => (
            <Link 
              key={cat.name}
              to={cat.path}
              style={{
                textDecoration: 'none',
                color: isActive(cat.path) ? 'var(--charcoal)' : 'var(--stone-600)',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'Jost, sans-serif',
                fontWeight: isActive(cat.path) ? 500 : 400,
                borderBottom: isActive(cat.path) ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: 4,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--charcoal)', textDecoration: 'none' }}>
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 600
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="user-menu-container" style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                  color: 'var(--charcoal)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <User size={20} />
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 12,
                  background: 'white',
                  border: '1px solid var(--stone-200)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: 180,
                  zIndex: 1000
                }}>
                  {/* Admin Dashboard Link - ONLY for admins */}
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowUserMenu(false)}
                      style={{ 
                        display: 'block',
                        padding: '12px 16px', 
                        textDecoration: 'none', 
                        color: 'var(--accent)',
                        fontSize: '0.85rem',
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: 500,
                        borderBottom: '1px solid var(--stone-100)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--stone-50)'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}

                  <Link 
                    to="/profile" 
                    onClick={() => setShowUserMenu(false)}
                    style={{ 
                      display: 'block',
                      padding: '12px 16px', 
                      textDecoration: 'none', 
                      color: 'var(--charcoal)',
                      fontSize: '0.85rem',
                      fontFamily: 'Jost, sans-serif',
                      borderBottom: '1px solid var(--stone-100)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--stone-50)'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                  >
                    👤 My Profile
                  </Link>

                  {/* My Orders - ONLY for customers */}
                  {user?.role !== 'admin' && (
                    <Link 
                      to="/orders/my-orders" 
                      onClick={() => setShowUserMenu(false)}
                      style={{ 
                        display: 'block',
                        padding: '12px 16px', 
                        textDecoration: 'none', 
                        color: 'var(--charcoal)',
                        fontSize: '0.85rem',
                        fontFamily: 'Jost, sans-serif',
                        borderBottom: '1px solid var(--stone-100)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--stone-50)'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      📦 My Orders
                    </Link>
                  )}

                  <button 
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    style={{ 
                      width: '100%',
                      padding: '12px 16px', 
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#d32f2f',
                      fontSize: '0.85rem',
                      fontFamily: 'Jost, sans-serif',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fef0f0'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ color: 'var(--charcoal)', textDecoration: 'none' }}>
              <User size={20} />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--charcoal)',
              padding: 0,
              display: 'none'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          style={{ 
            background: 'white',
            borderTop: '1px solid var(--stone-200)',
            padding: '20px 32px',
            display: 'none'
          }}
          className="mobile-menu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link 
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive('/') ? 'var(--charcoal)' : 'var(--stone-600)',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'Jost, sans-serif',
                fontWeight: isActive('/') ? 500 : 400,
                padding: '8px 0',
                borderBottom: '1px solid var(--stone-100)'
              }}
            >
              🏠 Home
            </Link>
            {categories.map(cat => (
              <Link 
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: isActive(cat.path) ? 'var(--charcoal)' : 'var(--stone-600)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: isActive(cat.path) ? 500 : 400,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--stone-100)'
                }}
              >
                {cat.name}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                {/* Admin Dashboard - ONLY for admins */}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      fontFamily: 'Jost, sans-serif',
                      fontWeight: 500,
                      padding: '8px 0',
                      borderBottom: '1px solid var(--stone-100)'
                    }}
                  >
                    ⚙️ Admin Dashboard
                  </Link>
                )}

                <Link 
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--stone-600)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: 'Jost, sans-serif',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--stone-100)'
                  }}
                >
                  👤 My Profile
                </Link>

                {/* My Orders - ONLY for customers */}
                {user?.role !== 'admin' && (
                  <Link 
                    to="/orders/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--stone-600)',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      fontFamily: 'Jost, sans-serif',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--stone-100)'
                    }}
                  >
                    📦 My Orders
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: '#d32f2f',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: 'Jost, sans-serif',
                    padding: '8px 0',
                    cursor: 'pointer'
                  }}
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;