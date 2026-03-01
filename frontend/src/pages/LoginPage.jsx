import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      
      sessionStorage.setItem('showWelcome', 'true');
      sessionStorage.setItem('userName', userData.profile?.name || userData.email?.split('@')[0]);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (status === 404) {
          setError('Account not found. Please check your email or register.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(message || 'Login failed. Please try again.');
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--warm-white)'
    }}>
      
      <style>{`
        @media (max-width: 768px) {
          .login-image {
            display: none !important;
          }
          .login-form-container {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Left Side - Image */}
      <div 
        className="login-image"
        style={{
          flex: 1,
          backgroundImage: 'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(28, 26, 24, 0.8), rgba(201, 169, 110, 0.3))'
        }} />
        
        <div style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
          color: 'white'
        }}>
          <h1 className="font-display" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 400,
            marginBottom: 24,
            lineHeight: 1.1
          }}>
            Elite Interiors
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.6,
            opacity: 0.9,
            fontFamily: 'Jost, sans-serif',
            maxWidth: 500
          }}>
            Curate your perfect space with our premium furniture collection
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div 
        className="login-form-container"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px'
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          
          <div style={{ marginBottom: 40 }}>
            <span style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: 'var(--accent)',
              fontFamily: 'Jost, sans-serif',
              fontWeight: 500
            }}>
              Welcome Back
            </span>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
              fontWeight: 400, 
              color: 'var(--charcoal)',
              marginTop: 8,
              marginBottom: 12,
              fontFamily: 'Playfair Display, serif'
            }}>
              Sign In
            </h2>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--stone-600)',
              fontFamily: 'Jost, sans-serif'
            }}>
              Access your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              background: '#fdf0f0', 
              border: '1px solid #f5c0c0', 
              padding: '14px 18px', 
              marginBottom: 24, 
              borderRadius: 4,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10
            }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: -2 }}>⚠️</span>
              <p style={{ 
                fontSize: '0.85rem', 
                color: '#8a2020',
                fontFamily: 'Jost, sans-serif',
                lineHeight: 1.5,
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div>
              <label className="field-label">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required 
                className="field-input" 
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required 
                className="field-input" 
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ 
                marginTop: 8,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>

          <p style={{ 
            textAlign: 'center', 
            marginTop: 32, 
            fontSize: '0.85rem', 
            color: 'var(--stone-600)',
            fontFamily: 'Jost, sans-serif'
          }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: 'var(--accent)', 
                textDecoration: 'none', 
                fontWeight: 500,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;