import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [query, setQuery]             = useState('');
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setQuery('');
    setSearchOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Collection', to: '/products' },
    { label: 'Living Room', to: '/products?category=Living Room' },
    { label: 'Bedroom', to: '/products?category=Bedroom' },
    { label: 'Office', to: '/products?category=Office' },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(253,252,250,0.96)' : 'rgba(253,252,250,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? '#e4ddd3' : 'transparent'}`,
        transition: 'all 0.4s ease',
      }}>

        {/* Top strip */}
        <div style={{
          background: '#1c1a18', color: '#f8f5f0',
          fontSize: '0.7rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', textAlign: 'center',
          padding: '8px 0', fontFamily: 'Jost, sans-serif', fontWeight: 400
        }}>
          Complimentary delivery on orders over R2,000
        </div>

        {/* Main nav */}
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 64
        }}>

          {/* Left – nav links */}
          <nav className="hidden md:flex" style={{ gap: 28 }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              const LinkIcon = link.icon;
              
              return (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  style={{
                    fontFamily: 'Jost, sans-serif', fontSize: '0.75rem',
                    fontWeight: isActive ? 500 : 400, 
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase', 
                    color: isActive ? '#1c1a18' : '#7c6f63',
                    textDecoration: 'none', 
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    borderBottom: isActive ? '2px solid #9c7d5a' : '2px solid transparent',
                    paddingBottom: 2
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1c1a18'}
                  onMouseLeave={e => e.currentTarget.style.color = isActive ? '#1c1a18' : '#7c6f63'}
                >
                  {LinkIcon && <LinkIcon size={14} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Centre – logo (still clickable) */}
          <Link to="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="font-display" style={{
                fontSize: '1.35rem', fontWeight: 500,
                letterSpacing: '0.08em', color: '#1c1a18',
                display: 'block', lineHeight: 1
              }}>
                Elite Interiors
              </span>
              <span style={{
                fontSize: '0.55rem', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: '#9c7d5a',
                fontFamily: 'Jost, sans-serif', fontWeight: 400
              }}>
                Est. 2026
              </span>
            </div>
          </Link>

          {/* Right – icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7c6f63', transition: 'color 0.2s', padding: 4
            }}
              onMouseEnter={e => e.target.style.color = '#1c1a18'}
              onMouseLeave={e => e.target.style.color = '#7c6f63'}
            >
              <Search size={18} />
            </button>

            {isLoggedIn ? (
              <Link to="/profile" style={{ color: '#7c6f63', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1c1a18'}
                onMouseLeave={e => e.currentTarget.style.color = '#7c6f63'}
              >
                <User size={18} />
              </Link>
            ) : (
              <Link to="/login" style={{ color: '#7c6f63' }}><User size={18} /></Link>
            )}

            {isAdmin && (
              <Link to="/admin" style={{
                fontFamily: 'Jost, sans-serif', fontSize: '0.7rem',
                fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#9c7d5a',
                textDecoration: 'none', padding: '4px 10px',
                border: '1px solid #c4a882', borderRadius: 2
              }}>Admin</Link>
            )}

            <Link to="/cart" style={{ position: 'relative', color: '#7c6f63' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#9c7d5a', color: 'white',
                  fontSize: '0.6rem', fontWeight: 600,
                  width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cartCount}</span>
              )}
            </Link>

            {isLoggedIn && (
              <button onClick={() => { logout(); navigate('/'); }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Jost, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#b5a99a', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#1c1a18'}
                onMouseLeave={e => e.target.style.color = '#b5a99a'}
              >
                Logout
              </button>
            )}

            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c6f63' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div style={{
            background: 'var(--warm-white)',
            borderTop: '1px solid var(--stone-200)',
            padding: '20px 32px',
            animation: 'fadeIn 0.25s ease'
          }}>
            <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-400)' }} />
              <input
                autoFocus type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for pieces..."
                className="field-input"
                style={{ paddingLeft: 28, fontSize: '1rem' }}
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'var(--warm-white)', borderTop: '1px solid var(--stone-200)',
            padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20
          }}>
            {navLinks.map(link => {
              const LinkIcon = link.icon;
              return (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setMobileOpen(false)} 
                  style={{
                    fontFamily: 'Jost, sans-serif', fontSize: '0.8rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--charcoal)', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  {LinkIcon && <LinkIcon size={16} />}
                  {link.label}
                </Link>
              );
            })}
            <Link to="/cart" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none' }}>Cart ({cartCount})</Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none' }}>Profile</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none' }}>Orders</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9c7d5a', textDecoration: 'none' }}>Admin</Link>}
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: 88 }} />
    </>
  );
};

export default Navbar;