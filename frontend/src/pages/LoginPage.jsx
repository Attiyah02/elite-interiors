import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
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

    console.log('🔐 Starting login...');
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);

    try {
      console.log('📤 Calling authAPI.login...');
      const res = await authAPI.login({ email, password });
      console.log('✅ API Response:', res.data);
      
      // Save to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      console.log('💾 Saved to localStorage');
      console.log('💾 Token:', localStorage.getItem('token'));
      console.log('💾 User:', localStorage.getItem('user'));
      
      // Update auth context
      console.log('🔄 Calling login context function...');
      login(res.data.token, res.data);
      console.log('🔄 Auth context updated');

      // Set welcome message
      sessionStorage.setItem('showWelcome', 'true');
      sessionStorage.setItem('userName', res.data.profile?.name || res.data.email?.split('@')[0]);
      console.log('👋 Welcome message set for:', res.data.profile?.name || res.data.email?.split('@')[0]);
      
      // Redirect based on role
      const redirectPath = res.data.role === 'admin' ? '/admin' : '/';
      console.log('➡️ User role:', res.data.role);
      console.log('➡️ Redirecting to:', redirectPath);
      
      navigate(redirectPath);
      console.log('✨ Navigation called');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error request:', err.request);
      console.error('❌ Error message:', err.message);
      
      // Handle different error types
      if (err.response) {
        // Server responded with error
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
        // Request made but no response
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      console.log('🏁 Login attempt finished');
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '48px 32px',
      background: 'var(--warm-white)'
    }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">
        
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
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
          <h1 className="font-display" style={{ 
            fontSize: '2rem', 
            fontWeight: 400, 
            color: 'var(--charcoal)',
            marginTop: 8,
            lineHeight: 1.2
          }}>
            Sign In
          </h1>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'var(--stone-600)',
            marginTop: 12,
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
            <span style={{ 
              fontSize: '1.2rem',
              flexShrink: 0,
              marginTop: -2
            }}>⚠️</span>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
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
            
            <Link 
              to="/forgot-password" 
              style={{ 
                fontSize: '0.75rem', 
                color: 'var(--accent)', 
                textDecoration: 'none', 
                display: 'block', 
                marginTop: 8,
                fontFamily: 'Jost, sans-serif',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Forgot password?
            </Link>
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
          marginTop: 28, 
          fontSize: '0.8rem', 
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

        {/* Demo Credentials Hint */}
        <div style={{
          marginTop: 32,
          padding: '16px',
          background: 'var(--stone-100)',
          borderRadius: 4,
          borderLeft: '4px solid var(--accent)'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--stone-700)',
            fontFamily: 'Jost, sans-serif',
            lineHeight: 1.6,
            margin: 0
          }}>
            <strong>Demo Admin Account:</strong><br />
            Email: admin@eliteinteriors.com<br />
            Password: Admin123!
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;