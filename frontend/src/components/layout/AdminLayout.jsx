import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--warm-white)' }}>
      
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            left: ${sidebarOpen ? '0' : '-280px'} !important;
            transition: left 0.3s !important;
            z-index: 1000 !important;
            box-shadow: ${sidebarOpen ? '4px 0 12px rgba(0,0,0,0.1)' : 'none'} !important;
          }
          
          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'} !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0,0,0,0.5) !important;
            z-index: 999 !important;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .admin-sidebar {
            position: sticky !important;
            top: 0 !important;
            left: 0 !important;
          }
          
          .sidebar-overlay {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Sidebar Overlay (Mobile) */}
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 280,
        background: '#1c1a18',
        color: 'var(--warm-white)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        {/* Header */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 className="font-display" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 400, 
            marginBottom: 4,
            color: 'var(--warm-white)'
          }}>
            Elite Interiors
          </h1>
          <p style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontFamily: 'Jost, sans-serif'
          }}>
            Admin Panel
          </p>
        </div>

        {/* User Info */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)'
        }}>
          <p style={{ 
            fontSize: '0.65rem', 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 4,
            fontFamily: 'Jost, sans-serif'
          }}>
            Signed in as
          </p>
          <p style={{ 
            fontSize: '0.85rem', 
            color: 'var(--warm-white)',
            fontFamily: 'Jost, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user?.email || user?.profile?.name || 'Admin'}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '24px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 24px',
                  textDecoration: 'none',
                  color: active ? 'var(--warm-white)' : 'rgba(255,255,255,0.6)',
                  background: active ? 'var(--accent)' : 'transparent',
                  borderLeft: active ? '4px solid var(--warm-white)' : '4px solid transparent',
                  fontSize: '0.9rem',
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: active ? 500 : 400,
                  transition: 'all 0.2s',
                  marginBottom: 4
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.color = 'var(--warm-white)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255,255,255,0.6)';
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.85rem',
              fontFamily: 'Jost, sans-serif',
              cursor: 'pointer',
              marginBottom: 12,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = 'var(--warm-white)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)';
              e.target.style.color = 'rgba(255,255,255,0.8)';
            }}
          >
            <ArrowLeft size={16} />
            Back to Store
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
              fontFamily: 'Jost, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(220,38,38,0.1)';
              e.target.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(220,38,38,0.3)';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Mobile Header */}
        <div className="mobile-menu-btn" style={{
          display: 'none',
          padding: '16px 24px',
          background: 'white',
          borderBottom: '1px solid var(--stone-200)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--charcoal)'
            }}
          >
            ☰
          </button>
        </div>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;