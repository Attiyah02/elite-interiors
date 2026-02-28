// ProfilePage.jsx
import { useState, useEffect } from 'react';
import { User, Heart, Package } from 'lucide-react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authAPI.getProfile().then(res => {
      setProfile(res.data);
      setForm({
        name: res.data.profile?.name || '',
        phone: res.data.profile?.phone || '',
        address: res.data.profile?.address || ''
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    try {
      await authAPI.updateProfile(form);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          Account
        </span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
          My Profile
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>

        {/* Profile Info */}
        <div>
          <div style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 32 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, background: 'var(--stone-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                    {form.name || 'No name set'}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-outline"
                style={{ padding: '10px 24px' }}
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {saved && (
              <div style={{ background: '#f0faf4', border: '1px solid #c3e6cd', padding: '12px 16px', marginBottom: 24, fontSize: '0.85rem', color: '#2d7a4f', fontFamily: 'Jost, sans-serif' }}>
                ✓ Profile updated successfully
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label className="field-label">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!editing}
                  className="field-input"
                  placeholder="John Doe"
                  style={{ opacity: editing ? 1 : 0.6 }}
                />
              </div>
              <div>
                <label className="field-label">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing}
                  className="field-input"
                  placeholder="082 000 0000"
                  style={{ opacity: editing ? 1 : 0.6 }}
                />
              </div>
              <div>
                <label className="field-label">Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  disabled={!editing}
                  className="field-input"
                  placeholder="123 Main Street, Cape Town, 8001"
                  rows="3"
                  style={{ opacity: editing ? 1 : 0.6, resize: 'vertical' }}
                />
              </div>
              {editing && (
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 24, textAlign: 'center' }}>
            <Heart size={28} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
            <p className="font-display" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--charcoal)' }}>
              {profile?.wishlist?.length || 0}
            </p>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
              Wishlist Items
            </p>
          </div>
          
          <div style={{ background: 'var(--stone-100)', padding: 20 }}>
            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone-600)', marginBottom: 12, fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
              Account Details
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal)', marginBottom: 6, fontFamily: 'Jost, sans-serif' }}>
              <span style={{ color: 'var(--stone-500)' }}>Role:</span> <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user?.role}</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}>
              <span style={{ color: 'var(--stone-500)' }}>Email:</span> <span style={{ fontWeight: 500 }}>{user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist */}
      {profile?.wishlist?.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              My Wishlist
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
            {profile.wishlist.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;