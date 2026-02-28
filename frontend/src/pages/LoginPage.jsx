import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true);
    try {
      const user = await login(email, password);
      
      // Store welcome flag in sessionStorage
      sessionStorage.setItem('showWelcome', 'true');
      sessionStorage.setItem('userName', user.name || user.email.split('@')[0]);
      
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex' }}>

      {/* Left – decorative panel */}
      <div className="hidden md:flex" style={{
        flex: 1, background: 'var(--stone-100)',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, padding: 48,
        position: 'relative'
      }}>
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
          alt="Interior"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', opacity: 0.4 }}
        />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.2, display: 'block' }}>
            Refined Living<br />Starts Here
          </span>
          <span className="divider" style={{ margin: '16px auto' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--stone-600)', letterSpacing: '0.08em', fontFamily: 'Jost, sans-serif' }}>
            Premium furniture for discerning tastes
          </p>
        </div>
      </div>

      {/* Right – form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: 'var(--warm-white)' }}>
        <div style={{ width: '100%', maxWidth: 380 }} className="animate-fade-up">

          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
              Welcome back
            </span>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8, lineHeight: 1.2 }}>
              Sign In
            </h1>
          </div>

          {error && (
            <div style={{ background: '#fdf0f0', border: '1px solid #f5c0c0', borderRadius: 4, padding: '12px 16px', marginBottom: 24, fontSize: '0.85rem', color: '#8a2020' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <label className="field-label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="field-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="field-input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.8rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
            New to Elite Interiors?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;