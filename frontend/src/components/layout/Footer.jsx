import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1c1a18', color: '#f8f5f0', marginTop: 'auto' }}>
    {/* Main */}
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }} className="grid-cols-1 md:grid-cols-4">

      <div>
        <div className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.06em', marginBottom: 8 }}>
          Elite Interiors
        </div>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9c7d5a', marginBottom: 20 }}>
          Est. 2026
        </div>
        <p style={{ fontSize: '0.875rem', color: 'rgba(248,245,240,0.4)', lineHeight: 1.8, maxWidth: 260, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          Curated furniture for refined living. Each piece selected for its craftsmanship, comfort, and enduring design.
        </p>
      </div>

      {[
        {
          heading: 'Shop',
          links: [
            { label: 'All Pieces', to: '/products' },
            { label: 'Living Room', to: '/products?category=Living Room' },
            { label: 'Bedroom', to: '/products?category=Bedroom' },
            { label: 'Office', to: '/products?category=Office' },
            { label: 'Dining', to: '/products?category=Dining' },
          ]
        },
        {
          heading: 'Account',
          links: [
            { label: 'Sign In', to: '/login' },
            { label: 'Register', to: '/register' },
            { label: 'My Orders', to: '/orders' },
            { label: 'Wishlist', to: '/profile' },
          ]
        },
        {
          heading: 'Information',
          links: [
            { label: 'Free delivery over R2,000', to: '#' },
            { label: 'Cash · Card · PayPal', to: '#' },
            { label: '30-day returns', to: '#' },
          ]
        }
      ].map(col => (
        <div key={col.heading}>
          <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9c7d5a', marginBottom: 20, fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
            {col.heading}
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {col.links.map(l => (
              <Link key={l.label} to={l.to} style={{ fontSize: '0.8rem', color: 'rgba(248,245,240,0.4)', textDecoration: 'none', fontFamily: 'Jost, sans-serif', fontWeight: 300, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#f8f5f0'}
                onMouseLeave={e => e.target.style.color = 'rgba(248,245,240,0.4)'}
              >{l.label}</Link>
            ))}
          </nav>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 32px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ fontSize: '0.72rem', color: 'rgba(248,245,240,0.25)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.04em' }}>
        © 2026 Elite Interiors. All rights reserved.
      </p>
      <p style={{ fontSize: '0.72rem', color: 'rgba(248,245,240,0.25)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.04em' }}>
        Premium Furniture for Refined Living
      </p>
    </div>
  </footer>
);

export default Footer;