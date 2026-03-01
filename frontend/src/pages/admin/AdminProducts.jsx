import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { productsAPI } from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll({});
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: 'clamp(32px, 5vw, 48px)' }}>
        <p style={{ textAlign: 'center', color: 'var(--stone-600)', fontFamily: 'Jost, sans-serif' }}>
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: 400,
          color: 'var(--charcoal)',
          marginBottom: 8
        }}>
          Products
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
          color: 'var(--stone-600)',
          fontFamily: 'Jost, sans-serif'
        }}>
          {filteredProducts.length} products total
        </p>
      </div>

      {/* Actions Bar */}
      <div style={{ 
        display: 'flex',
        gap: 16,
        marginBottom: 32,
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--stone-400)'
            }}
          />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid var(--stone-200)',
              fontSize: '0.9rem',
              fontFamily: 'Jost, sans-serif',
              borderRadius: 2
            }}
          />
        </div>

        <button
          onClick={() => alert('Add product feature coming soon')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            fontSize: '0.85rem',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.target.style.background = '#B8935A'}
          onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div style={{ background: 'white', border: '1px solid var(--stone-200)', borderRadius: 2, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: 'var(--stone-50)' }}>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif',
                width: '40%'
              }}>
                Product
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Category
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Price
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Stock
              </th>
              <th style={{ 
                padding: '16px 24px',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--stone-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Jost, sans-serif'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr 
                key={product._id}
                style={{ borderBottom: '1px solid var(--stone-100)' }}
              >
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={product.name}
                      style={{ 
                        width: 60,
                        height: 60,
                        objectFit: 'contain',
                        background: 'var(--stone-50)',
                        padding: 4,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ 
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--charcoal)',
                        fontFamily: 'Jost, sans-serif',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.name}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem',
                        color: 'var(--stone-500)',
                        fontFamily: 'Jost, sans-serif'
                      }}>
                        {product.subcategory}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  fontSize: '0.85rem',
                  color: 'var(--stone-600)',
                  fontFamily: 'Jost, sans-serif'
                }}>
                  {product.category}
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  fontFamily: 'Jost, sans-serif'
                }}>
                  R {product.price.toLocaleString()}
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    fontFamily: 'Jost, sans-serif',
                    background: product.inStock ? '#e8f5e9' : '#fdf0f0',
                    color: product.inStock ? '#2e7d32' : '#8a2020'
                  }}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td style={{ 
                  padding: '20px 24px',
                  textAlign: 'right'
                }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => alert('Edit feature coming soon')}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--stone-100)',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--stone-200)'}
                      onMouseLeave={(e) => e.target.style.background = 'var(--stone-100)'}
                    >
                      <Edit2 size={16} color="var(--charcoal)" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        padding: '8px 12px',
                        background: '#fdf0f0',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fcc'}
                      onMouseLeave={(e) => e.target.style.background = '#fdf0f0'}
                    >
                      <Trash2 size={16} color="#d32f2f" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ 
              color: 'var(--stone-500)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.9rem'
            }}>
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;