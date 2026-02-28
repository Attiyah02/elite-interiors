import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Sparkles, ArrowRight, X } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [prompt, setPrompt] = useState('');
  const [topSelling, setTopSelling] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check for welcome message
  useEffect(() => {
    const shouldShowWelcome = sessionStorage.getItem('showWelcome');
    const userName = sessionStorage.getItem('userName');
    
    if (shouldShowWelcome === 'true' && userName) {
      setShowWelcome(true);
      sessionStorage.removeItem('showWelcome');
      sessionStorage.removeItem('userName');
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, catRes] = await Promise.all([
          productsAPI.getTopSelling(),
          categoriesAPI.getAll()
        ]);
        setTopSelling(topRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await productsAPI.aiSearch(prompt);
      navigate('/products', {
        state: {
          aiResults: res.data.products,
          aiPrompt: prompt,
          searchCriteria: res.data.extractedCriteria
        }
      });
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageSearch = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAiLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Call image search API
      const response = await fetch('http://localhost:5000/api/image-search', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.products && data.products.length > 0) {
        // Navigate to products page with results
        navigate('/products', {
          state: {
            aiResults: data.products,
            aiPrompt: `Image search: ${data.detectedFurniture.join(', ')} in ${data.detectedColors.join(', ')}`,
            searchCriteria: {
              detectedLabels: data.detectedLabels,
              detectedColors: data.detectedColors,
              detectedFurniture: data.detectedFurniture
            }
          }
        });
      } else {
        alert('No similar products found. Try a different image!');
      }

    } catch (error) {
      console.error('Image search error:', error);
      alert('Image search failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading collection..." />;

  const userName = sessionStorage.getItem('userName') || user?.name || user?.email?.split('@')[0];

  return (
    <div>
      {/* Welcome Banner */}
      {showWelcome && userName && (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
          color: 'white',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          animation: 'slideDown 0.5s ease'
        }}>
          <div>
            <p style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              opacity: 0.9,
              marginBottom: 4,
              fontFamily: 'Jost, sans-serif'
            }}>
              Welcome Back
            </p>
            <p className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
              {userName}
            </p>
          </div>
          <button 
            onClick={() => setShowWelcome(false)}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              borderRadius: '50%',
              width: 32, 
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero */}
      <section style={{ 
        background: 'linear-gradient(to bottom, var(--stone-100) 0%, var(--warm-white) 100%)',
        padding: '80px 32px 100px'
      }} className="animate-fade-in">
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ 
            fontSize: '0.65rem', letterSpacing: '0.25em', 
            textTransform: 'uppercase', color: 'var(--accent)',
            fontFamily: 'Jost, sans-serif', fontWeight: 500
          }}>
            Curated for Refined Living
          </span>

          <h1 className="font-display animate-fade-up delay-100" style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400, color: 'var(--charcoal)',
            marginTop: 16, marginBottom: 24,
            lineHeight: 1.15, letterSpacing: '0.02em'
          }}>
            Premium Furniture<br />for Discerning Tastes
          </h1>

          <span className="divider animate-fade-up delay-200" style={{ margin: '0 auto 32px' }} />

          <p className="animate-fade-up delay-300" style={{ 
            fontSize: '1.05rem', color: 'var(--stone-600)',
            maxWidth: 600, margin: '0 auto 48px',
            lineHeight: 1.7, fontFamily: 'Jost, sans-serif', fontWeight: 300
          }}>
            Each piece thoughtfully selected for its craftsmanship, comfort, and timeless design
          </p>

          <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Explore Collection
            </button>
            <button onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline">
              Find Your Piece
            </button>
          </div>
        </div>
      </section>

      {/* AI Search Section */}
      <section id="search-section" className="section" style={{ background: 'var(--warm-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
              Find Your Perfect Piece
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 12 }}>
              How Can We Help?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            
            {/* AI Search */}
            <div style={{ background: 'white', padding: 32, borderRadius: 0, border: '1px solid var(--stone-200)' }}>
              <div style={{ marginBottom: 20 }}>
                <Sparkles size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
                  Describe Your Vision
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--stone-600)', lineHeight: 1.6, fontFamily: 'Jost, sans-serif' }}>
                  Tell us what you're looking for and we'll find the perfect match
                </p>
              </div>
              <form onSubmit={handleAiSearch}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A comfortable velvet sofa in sage green, under R8000, for a small living room..."
                  style={{ 
                    width: '100%', minHeight: 100, padding: 12,
                    border: '1px solid var(--stone-200)', 
                    borderRadius: 0, fontSize: '0.875rem',
                    fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)',
                    marginBottom: 16, resize: 'vertical'
                  }}
                />
                <button type="submit" disabled={aiLoading || !prompt.trim()} className="btn-primary" style={{ width: '100%' }}>
                  {aiLoading ? 'Searching...' : 'Find Pieces'}
                </button>
              </form>
            </div>

            {/* Browse by Room */}
            <div style={{ background: 'white', padding: 32, borderRadius: 0, border: '1px solid var(--stone-200)' }}>
              <div style={{ marginBottom: 20 }}>
                <Search size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
                  Browse by Room
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--stone-600)', lineHeight: 1.6, fontFamily: 'Jost, sans-serif' }}>
                  Explore our curated collections by space
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', background: 'var(--stone-100)',
                      border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'var(--charcoal)',
                      fontFamily: 'Jost, sans-serif', fontWeight: 400,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--stone-200)';
                      e.target.style.paddingLeft = '20px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--stone-100)';
                      e.target.style.paddingLeft = '16px';
                    }}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Image Search */}
            <div style={{ background: 'white', padding: 32, borderRadius: 0, border: '1px solid var(--stone-200)' }}>
              <div style={{ marginBottom: 20 }}>
                <Upload size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: 8 }}>
                  Visual Search
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--stone-600)', lineHeight: 1.6, fontFamily: 'Jost, sans-serif' }}>
                  Upload an image to find similar pieces
                </p>
              </div>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 140, border: '2px dashed var(--stone-200)',
                cursor: 'pointer', transition: 'all 0.2s',
                position: 'relative'
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--stone-200)'}
              >
                {aiLoading ? (
                  <>
                    <div style={{ 
                      width: 32, height: 32, 
                      border: '2px solid var(--stone-200)', 
                      borderTopColor: 'var(--accent)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginBottom: 8
                    }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                      Analyzing image...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={32} style={{ color: 'var(--stone-400)', marginBottom: 8 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
                      Click or drop image here
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif', marginTop: 4 }}>
                      JPG, PNG (max 5MB)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSearch}
                  disabled={aiLoading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="section" style={{ background: 'var(--stone-100)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                Bestsellers
              </span>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--charcoal)', marginTop: 8 }}>
                Most Loved Pieces
              </h2>
            </div>
            <button onClick={() => navigate('/products?sortBy=popular')} className="btn-outline">
              View All
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
            {topSelling.slice(0, 8).map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Elite Interiors */}
      <section className="section" style={{ background: 'var(--charcoal)', color: 'var(--warm-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: 16 }}>
              Why Elite Interiors
            </h2>
            <span className="divider" style={{ margin: '0 auto', background: 'var(--accent)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 48 }}>
            {[
              { title: 'Curated Selection', desc: 'Every piece handpicked for quality and design excellence' },
              { title: 'Expert Guidance', desc: 'AI-powered search to help you find your perfect piece' },
              { title: 'Premium Quality', desc: 'Crafted from the finest materials for lasting beauty' },
              { title: 'White Glove Service', desc: 'Complimentary delivery and setup on orders over R2,000' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }} className="animate-fade-up delay-100">
                <span className="divider" style={{ margin: '0 auto 20px', background: 'var(--accent)' }} />
                <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: 12, color: 'var(--warm-white)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(248,245,240,0.6)', lineHeight: 1.7, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;