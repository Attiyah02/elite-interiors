import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const navItems = [
    { path: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products',  icon: Package },
    { path: '/admin/orders',   label: 'Orders',    icon: ShoppingBag },
    { path: '/admin/reports',  label: 'Reports',   icon: BarChart3 },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--stone-100)', fontFamily: 'Jost, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 220,
        background: 'var(--charcoal)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0, position: 'relative'
      }}>

        {/* Logo area */}
        <div style={{ padding: collapsed ? '24px 0' : '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {!collapsed && (
            <>
              <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--warm-white)', letterSpacing: '0.04em' }}>
                Elite Interiors
              </div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: 2 }}>
                Admin Panel
              </div>
            </>
          )}
        </div>

        {/* User badge */}
        {!collapsed && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Signed in as</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(248,245,240,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px 0' : '11px 20px',
                textDecoration: 'none',
                color: active ? 'var(--warm-white)' : 'rgba(248,245,240,0.4)',
                background: active ? 'rgba(156,125,90,0.15)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s ease', fontSize: '0.8rem',
                letterSpacing: '0.06em', fontWeight: active ? 500 : 300,
                whiteSpace: 'nowrap', overflow: 'hidden'
              }}>
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', color: 'rgba(248,245,240,0.3)', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
              ← Back to Store
            </Link>
          )}
          <button onClick={() => { logout(); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 20px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(248,245,240,0.3)', width: '100%',
            fontSize: '0.75rem', letterSpacing: '0.06em',
            transition: 'color 0.2s', fontFamily: 'Jost, sans-serif'
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#f08080'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,245,240,0.3)'}
          >
            <LogOut size={14} style={{ flexShrink: 0 }} />
            {!collapsed && 'Logout'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', top: 28, right: -12,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--charcoal)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(248,245,240,0.5)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '36px 40px', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;