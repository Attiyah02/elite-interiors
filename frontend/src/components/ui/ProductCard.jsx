import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const price = product.price * (1 - (product.discount || 0) / 100);

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link 
      to={`/products/${product._id}`}
      className="animate-fade-up"
      style={{ 
        textDecoration: 'none', 
        display: 'block',
        animationDelay: `${index * 0.08}s`, 
        opacity: 0 
      }}
    >
      <article
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--stone-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
            alt={product.name}
            style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              padding: '16px'
            }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.discount > 0 && (
              <span className="badge badge-amber">−{product.discount}%</span>
            )}
            {product.specifications?.spaceEfficient && (
              <span className="tag">Compact</span>
            )}
          </div>

          {/* Quick add */}
          <button onClick={handleAdd} style={{
            position: 'absolute', bottom: 14, right: 14,
            background: added ? '#2d7a4f' : 'var(--charcoal)',
            color: 'white', border: 'none',
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.9)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 4px 20px rgba(28,26,24,0.25)'
          }}>
            {added ? '✓' : <Plus size={16} />}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '18px 20px 20px' }}>
          <span style={{
            fontSize: '0.65rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--stone-400)',
            fontFamily: 'Jost, sans-serif', fontWeight: 400
          }}>{product.category}</span>

          <h3 className="font-display" style={{
            fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)',
            marginTop: 4, marginBottom: 10, lineHeight: 1.3,
            letterSpacing: '0.01em',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'
          }}>{product.name}</h3>

          {/* Specs row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {product.specifications?.dimensions && (
              <span style={{ fontSize: '0.7rem', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif' }}>
                {product.specifications.dimensions.length}×{product.specifications.dimensions.width} cm
              </span>
            )}
            {product.specifications?.material?.primary && (
              <>
                <span style={{ fontSize: '0.7rem', color: 'var(--stone-200)' }}>·</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--stone-400)', fontFamily: 'Jost, sans-serif' }}>
                  {product.specifications.material.primary}
                </span>
              </>
            )}
          </div>

          {/* Color swatches */}
          {product.specifications?.colors?.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
              {product.specifications.colors.slice(0, 5).map((c, i) => (
                <div key={i} title={c} style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: colorHex(c),
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)'
                }} />
              ))}
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--stone-100)', paddingTop: 12 }}>
            <div>
              <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                R {price.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--stone-400)', textDecoration: 'line-through', marginLeft: 8 }}>
                  R {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const colorHex = (name) => {
  const map = {
    'grey':'#9CA3AF','gray':'#9CA3AF','beige':'#D4B896','white':'#F3F0EC',
    'black':'#2d2b28','navy blue':'#1E3A5F','navy':'#1E3A5F','charcoal':'#4B5563',
    'brown':'#92400E','natural':'#D4A76A','oak':'#C68B59','walnut':'#7B4F2E',
    'pink':'#F9A8D4','dusty pink':'#E8A0B0','green':'#6EE7B7',
    'forest green':'#065F46','sage green':'#86A789','mustard yellow':'#D97706',
    'cream':'#FEFCE8','terracotta':'#C1440E','gold':'#C9A96E','white gloss':'#F9FAFB',
    'grey matte':'#6B7280','light grey':'#D1D5DB',
  };
  return map[name?.toLowerCase()] || '#D4C5B0';
};

export default ProductCard;