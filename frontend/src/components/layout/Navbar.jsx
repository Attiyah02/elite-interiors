import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* User */}
          {isLoggedIn ? (
            <Link to="/profile" style={{ color: 'var(--charcoal)', textDecoration: 'none' }}>
              <User size={20} />
            </Link>
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