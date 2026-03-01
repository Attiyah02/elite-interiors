import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [aiResults, setAiResults] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    spaceEfficient: searchParams.get('spaceEfficient') || '',
  });

  useEffect(() => {
    const newFilters = {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'newest',
      spaceEfficient: searchParams.get('spaceEfficient') || '',
    };
    
    console.log('🔄 URL changed, new filters:', newFilters);
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.aiResults) {
      setAiResults(location.state.aiResults);
      setAiPrompt(location.state.aiPrompt);
      setLoading(false);
      return;
    }
  }, [location.state]);

  useEffect(() => {
    if (!location.state?.aiResults) {
      fetchProducts();
    }
  }, [filters]);

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.spaceEfficient) params.spaceEfficient = filters.spaceEfficient;

      console.log('📤 Fetching with params:', params);

      const res = await productsAPI.getAll(params);
      
      console.log('📥 Received products:', res.data.products.length);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setAiResults(null);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setAiResults(null);
    setAiPrompt('');
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'newest',
      spaceEfficient: ''
    });
  };

  const displayProducts = aiResults || products;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)' }}>

      <style>{`
        @media (min-width: 769px) {
          .products-layout {
            display: flex !important;
          }
          
          .filters-sidebar {
            width: 280px !important;
            flex-shrink: 0 !important;
          }
          
          .filters-mobile-overlay {
            display: none !important;
          }
        }
        
        @media (max-width: 768px) {
          .products-layout {
            display: block !important;
          }
          
          .filters-sidebar {
            display: none !important;
          }
          
          .filters-mobile-overlay {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: 1000 !important;
            overflow-y: auto !important;
          }
          
          .filters-mobile-content {
            background: white !important;
            min-height: 100vh !important;
            padding: 20px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ 
              fontSize: 'clamp(0.6rem, 1.5vw, 0.65rem)', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: 'var(--accent)', 
              fontFamily: 'Jost, sans-serif', 
              fontWeight: 500 
            }}>
              {aiPrompt ? 'AI Search Results' : 'Collection'}
            </span>
            <h1 className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: 400, 
              color: 'var(--charcoal)', 
              marginTop: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {filters.category || 'All Pieces'}
            </h1>
            {aiPrompt && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                marginTop: 12, 
                background: 'var(--stone-100)', 
                padding: '8px 14px', 
                borderRadius: 0, 
                width: 'fit-content',
                maxWidth: '100%'
              }}>
                <Sparkles size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ 
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)', 
                  color: 'var(--stone-600)', 
                  fontFamily: 'Jost, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  "{aiPrompt}"
                </span>
                <button 
                  onClick={clearFilters} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--stone-400)',
                    flexShrink: 0,
                    padding: 4
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="btn-outline" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)'
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
        <p style={{ 
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
          color: 'var(--stone-600)', 
          marginTop: 12, 
          fontFamily: 'Jost, sans-serif' 
        }}>
          {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'} 
          {aiPrompt ? ' match your search' : ' available'}
        </p>
      </div>

      <div className="products-layout" style={{ display: 'flex', gap: 48 }}>

        {/* Desktop Filters Sidebar */}
        <aside className="filters-sidebar" style={{ width: 280, flexShrink: 0, display: showFilters ? 'block' : 'none' }}>
          <div style={{ background: 'white', border: '1px solid var(--stone-200)', padding: 24, position: 'sticky', top: 100 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Filters
              </h3>
              <button 
                onClick={clearFilters} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.7rem', 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase', 
                  color: 'var(--accent)', 
                  fontFamily: 'Jost, sans-serif' 
                }}
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search pieces..."
                className="field-input"
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Room Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)' }}>
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  All Rooms
                </label>
                {categories.map(cat => (
                  <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)' }}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.name}
                      checked={filters.category === cat.name}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    {cat.icon} {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Price Range</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  placeholder="Min"
                  className="field-input"
                  style={{ width: '50%' }}
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="field-input"
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            {/* Space Efficient */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)' }}>
                <input
                  type="checkbox"
                  checked={filters.spaceEfficient === 'true'}
                  onChange={(e) => updateFilter('spaceEfficient', e.target.checked ? 'true' : '')}
                  style={{ accentColor: 'var(--accent)' }}
                />
                Space-Efficient Only
              </label>
            </div>

            {/* Sort */}
            <div>
              <label className="field-label">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="field-input"
                style={{ width: '100%', cursor: 'pointer', marginTop: 12 }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="filters-mobile-overlay" onClick={() => setShowFilters(false)}>
            <div className="filters-mobile-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Filters
                </h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: 8
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <button 
                onClick={clearFilters} 
                style={{ 
                  width: '100%',
                  marginBottom: 24,
                  padding: '12px',
                  background: 'none',
                  border: '1px solid var(--stone-300)',
                  cursor: 'pointer', 
                  fontSize: '0.75rem', 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase', 
                  color: 'var(--accent)', 
                  fontFamily: 'Jost, sans-serif' 
                }}
              >
                Clear All Filters
              </button>

              {/* Search */}
              <div style={{ marginBottom: 24 }}>
                <label className="field-label">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search pieces..."
                  className="field-input"
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: 24 }}>
                <label className="field-label">Room Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)', padding: '8px 0' }}>
                    <input
                      type="radio"
                      name="category-mobile"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
                    />
                    All Rooms
                  </label>
                  {categories.map(cat => (
                    <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)', padding: '8px 0' }}>
                      <input
                        type="radio"
                        name="category-mobile"
                        value={cat.name}
                        checked={filters.category === cat.name}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
                      />
                      {cat.icon} {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 24 }}>
                <label className="field-label">Price Range</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    placeholder="Min"
                    className="field-input"
                    style={{ width: '50%' }}
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="field-input"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>

              {/* Space Efficient */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)', padding: '8px 0' }}>
                  <input
                    type="checkbox"
                    checked={filters.spaceEfficient === 'true'}
                    onChange={(e) => updateFilter('spaceEfficient', e.target.checked ? 'true' : '')}
                    style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
                  />
                  Space-Efficient Only
                </label>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 24 }}>
                <label className="field-label">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="field-input"
                  style={{ width: '100%', cursor: 'pointer', marginTop: 12 }}
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="most-viewed">Most Viewed</option>
                </select>
              </div>

              {/* Apply Button */}
              <button 
                onClick={() => setShowFilters(false)}
                className="btn-primary"
                style={{ width: '100%', marginTop: 16 }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <LoadingSpinner text="Loading pieces..." />
          ) : displayProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 20px' }}>
              <h3 className="font-display" style={{ 
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', 
                fontWeight: 400, 
                color: 'var(--charcoal)', 
                marginBottom: 12 
              }}>
                No pieces found
              </h3>
              <p style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
                color: 'var(--stone-600)', 
                marginBottom: 24, 
                fontFamily: 'Jost, sans-serif' 
              }}>
                Try adjusting your filters
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 40vw, 280px), 1fr))', 
              gap: 'clamp(16px, 4vw, 32px)' 
            }}>
              {displayProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;