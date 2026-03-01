import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Ruler, Package, Clock } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, similarRes] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getSimilar(id)
        ]);
        setProduct(productRes.data);
        setSimilar(similarRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const selectedColor = product.specifications?.colors?.[selectedColorIndex];
    addToCart({ 
      ...product, 
      selectedColor,
      selectedImage: product.images?.[selectedImageIndex]
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleColorSelect = (index) => {
    setSelectedColorIndex(index);
    if (product.images?.[index]) {
      setSelectedImageIndex(index);
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--charcoal)' }}>
        Product not found
      </h2>
    </div>
  );

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const colors = product.specifications?.colors || [];
  const images = product.images || [];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)' }}>
      
      <style>{`
        @media (min-width: 769px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          
          .specs-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          
          .thumbnail-gallery {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 8px !important;
          }
          
          .thumbnail-gallery button {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
          }
          
          .specs-grid {
            grid-template-columns: 1fr !important;
          }
          
          .color-buttons {
            flex-wrap: wrap !important;
          }
          
          .quantity-cart-row {
            flex-direction: column !important;
          }
          
          .quantity-cart-row > div,
          .quantity-cart-row > button {
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .thumbnail-gallery {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-outline"
        style={{ 
          marginBottom: 32, 
          padding: '10px 20px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 'clamp(40px, 8vw, 80px)' }}>

        {/* Images Gallery */}
        <div>
          {/* Main Image */}
          <div style={{ 
            background: 'var(--stone-100)', 
            aspectRatio: '4/3', 
            marginBottom: 16,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={images[selectedImageIndex] || images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                padding: 'clamp(16px, 3vw, 24px)'
              }}
            />
            
            {/* Color indicator badge */}
            {colors[selectedColorIndex] && (
              <div style={{
                position: 'absolute', 
                top: 'clamp(8px, 2vw, 16px)', 
                left: 'clamp(8px, 2vw, 16px)',
                background: 'rgba(255,255,255,0.95)',
                padding: '8px 14px',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'Jost, sans-serif',
                fontWeight: 500,
                color: 'var(--charcoal)'
              }}>
                {colors[selectedColorIndex]}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="thumbnail-gallery" style={{ display: 'flex', gap: 12 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  style={{
                    width: 80, 
                    height: 80,
                    border: selectedImageIndex === i ? '2px solid var(--charcoal)' : '1px solid var(--stone-200)',
                    background: 'var(--stone-100)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    padding: 8,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={img} 
                    alt="" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain'
                    }} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span style={{ 
            fontSize: 'clamp(0.6rem, 1.5vw, 0.65rem)', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            color: 'var(--accent)',
            fontFamily: 'Jost, sans-serif', 
            fontWeight: 500
          }}>
            {product.category} › {product.subcategory}
          </span>

          <h1 className="font-display" style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 400, 
            color: 'var(--charcoal)',
            marginTop: 8, 
            marginBottom: 16, 
            lineHeight: 1.2
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <span className="font-display" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 500, color: 'var(--charcoal)' }}>
              R {discountedPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <>
                <span style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: 'var(--stone-400)', textDecoration: 'line-through' }}>
                  R {product.price.toLocaleString()}
                </span>
                <span className="badge badge-red" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>
                  −{product.discount}%
                </span>
              </>
            )}
          </div>

          <p style={{ 
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
            color: 'var(--stone-600)', 
            lineHeight: 1.7, 
            marginBottom: 32,
            fontFamily: 'Jost, sans-serif', 
            fontWeight: 300
          }}>
            {product.description}
          </p>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--stone-100)' }}>
              <label className="field-label" style={{ marginBottom: 16, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)' }}>
                Color: {colors[selectedColorIndex]}
              </label>
              <div className="color-buttons" style={{ display: 'flex', gap: 12 }}>
                {colors.map((color, i) => {
                  const isSelected = selectedColorIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleColorSelect(i)}
                      style={{
                        padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3vw, 20px)',
                        border: isSelected ? '2px solid var(--charcoal)' : '1px solid var(--stone-200)',
                        background: isSelected ? 'var(--charcoal)' : 'white',
                        color: isSelected ? 'white' : 'var(--charcoal)',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                        letterSpacing: '0.05em',
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: isSelected ? 500 : 400,
                        transition: 'all 0.2s',
                        textTransform: 'uppercase'
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div style={{ background: 'var(--stone-100)', padding: 'clamp(16px, 3vw, 24px)', marginBottom: 32 }}>
            <h3 style={{ 
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: 'var(--stone-600)',
              marginBottom: 16, 
              fontFamily: 'Jost, sans-serif', 
              fontWeight: 500
            }}>
              Specifications
            </h3>
            <div className="specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {product.specifications?.dimensions && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Ruler size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                      Dimensions
                    </p>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}>
                      {product.specifications.dimensions.length} × {product.specifications.dimensions.width} × {product.specifications.dimensions.height} cm
                    </p>
                  </div>
                </div>
              )}
              {product.specifications?.material?.primary && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Package size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                      Material
                    </p>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}>
                      {product.specifications.material.primary}
                    </p>
                  </div>
                </div>
              )}
              {product.specifications?.assemblyTime && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Clock size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                      Assembly Time
                    </p>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}>
                      {product.specifications.assemblyTime}
                    </p>
                  </div>
                </div>
              )}
              {product.specifications?.seatingCapacity && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 16, marginTop: 2 }}>🪑</span>
                  <div>
                    <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: 'var(--stone-500)', fontFamily: 'Jost, sans-serif' }}>
                      Seating
                    </p>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Jost, sans-serif' }}>
                      {product.specifications.seatingCapacity} people
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="quantity-cart-row" style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--stone-200)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px)',
                  fontFamily: 'Jost, sans-serif', 
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  color: 'var(--charcoal)'
                }}
              >
                −
              </button>
              <span style={{ 
                padding: 'clamp(10px, 2.5vw, 14px) clamp(16px, 3.5vw, 20px)', 
                fontFamily: 'Jost, sans-serif', 
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
                fontWeight: 500,
                borderLeft: '1px solid var(--stone-200)',
                borderRight: '1px solid var(--stone-200)',
                minWidth: 50, 
                textAlign: 'center'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px)',
                  fontFamily: 'Jost, sans-serif', 
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  color: 'var(--charcoal)'
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={added ? 'btn-accent' : 'btn-primary'}
              style={{ 
                flex: 1, 
                justifyContent: 'center', 
                gap: 10,
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 32px)'
              }}
            >
              <ShoppingCart size={18} />
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Style Tags */}
          {product.specifications?.style?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.specifications.style.map(s => (
                <span key={s} className="tag" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div>
          <div style={{ marginBottom: 40 }}>
            <h2 className="font-display" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
              fontWeight: 400, 
              color: 'var(--charcoal)' 
            }}>
              Similar Pieces
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 40vw, 280px), 1fr))', 
            gap: 'clamp(16px, 4vw, 32px)' 
          }}>
            {similar.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;