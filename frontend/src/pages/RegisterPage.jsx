import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form.email, form.password, form.name); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: 'var(--warm-white)' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">

        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
            Join us
          </span>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
            Create Account
          </h1>
        </div>

        {error && (
          <div style={{ background: '#fdf0f0', border: '1px solid #f5c0c0', borderRadius: 4, padding: '12px 16px', marginBottom: 24, fontSize: '0.85rem', color: '#8a2020' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {[
            { key:'name',    label:'Full Name',        type:'text',     ph:'John Doe' },
            { key:'email',   label:'Email Address',    type:'email',    ph:'you@example.com' },
            { key:'password',label:'Password',         type:'password', ph:'Minimum 6 characters' },
            { key:'confirm', label:'Confirm Password', type:'password', ph:'••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="field-label">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={set(f.key)} required className="field-input" placeholder={f.ph} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.8rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;