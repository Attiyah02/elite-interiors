import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    costPrice: '',
    discount: 0,
    images: [''],
    tags: '',
    specifications: {
      dimensions: { length: '', width: '', height: '', weight: '' },
      material: { primary: '', frame: '' },
      colors: '',
      assembly: 'Required',
      assemblyTime: '',
      spaceEfficient: false,
      style: ''
    }
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      price: '',
      costPrice: '',
      discount: 0,
      images: [''],
      tags: '',
      specifications: {
        dimensions: { length: '', width: '', height: '', weight: '' },
        material: { primary: '', frame: '' },
        colors: '',
        assembly: 'Required',
        assemblyTime: '',
        spaceEfficient: false,
        style: ''
      }
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      price: product.price || '',
      costPrice: product.costPrice || '',
      discount: product.discount || 0,
      images: product.images?.length > 0 ? product.images : [''],
      tags: product.tags?.join(', ') || '',
      specifications: {
        dimensions: product.specifications?.dimensions || { length: '', width: '', height: '', weight: '' },
        material: product.specifications?.material || { primary: '', frame: '' },
        colors: product.specifications?.colors?.join(', ') || '',
        assembly: product.specifications?.assembly || 'Required',
        assemblyTime: product.specifications?.assemblyTime || '',
        spaceEfficient: product.specifications?.spaceEfficient || false,
        style: product.specifications?.style?.join(', ') || ''
      }
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      discount: parseFloat(formData.discount) || 0,
      images: formData.images.filter(img => img.trim() !== ''),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      specifications: {
        dimensions: {
          length: parseFloat(formData.specifications.dimensions.length) || 0,
          width: parseFloat(formData.specifications.dimensions.width) || 0,
          height: parseFloat(formData.specifications.dimensions.height) || 0,
          weight: parseFloat(formData.specifications.dimensions.weight) || 0
        },
        material: formData.specifications.material,
        colors: formData.specifications.colors.split(',').map(c => c.trim()).filter(c => c !== ''),
        assembly: formData.specifications.assembly,
        assemblyTime: formData.specifications.assemblyTime,
        spaceEfficient: formData.specifications.spaceEfficient,
        style: formData.specifications.style.split(',').map(s => s.trim()).filter(s => s !== '')
      },
      inStock: true
    };

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        await productsAPI.create(productData);
        alert('Product created successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
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
          onClick={openAddModal}
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
                      onClick={() => openEditModal(product)}
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

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 4,
            width: '100%',
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--stone-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1
            }}>
              <h2 className="font-display" style={{
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--charcoal)'
              }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8
                }}
              >
                <X size={24} color="var(--stone-600)" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
              
              {/* Basic Info */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  marginBottom: 20,
                  fontFamily: 'Jost, sans-serif'
                }}>
                  Basic Information
                </h3>

                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <label className="field-label">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="field-input"
                      placeholder="e.g., Cloud Comfort Sofa"
                    />
                  </div>

                  <div>
                    <label className="field-label">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="field-input"
                      rows="3"
                      placeholder="Describe the product features and benefits..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="field-label">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="field-input"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label">Subcategory *</label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        required
                        className="field-input"
                        placeholder="e.g., Sofas"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  marginBottom: 20,
                  fontFamily: 'Jost, sans-serif'
                }}>
                  Pricing
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="field-label">Selling Price (R) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="field-input"
                      placeholder="2999"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="field-label">Cost Price (R) *</label>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      required
                      className="field-input"
                      placeholder="1500"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="field-label">Discount (%)</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="field-input"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  marginBottom: 20,
                  fontFamily: 'Jost, sans-serif'
                }}>
                  Product Images
                </h3>

                {formData.images.map((img, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      className="field-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      style={{ flex: 1 }}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        style={{
                          padding: '8px 12px',
                          background: '#fdf0f0',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: 2
                        }}
                      >
                        <X size={16} color="#d32f2f" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addImageField}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--stone-100)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: 'Jost, sans-serif',
                    borderRadius: 2
                  }}
                >
                  + Add Image URL
                </button>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  marginBottom: 20,
                  fontFamily: 'Jost, sans-serif'
                }}>
                  Tags & Attributes
                </h3>

                <div>
                  <label className="field-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="field-input"
                    placeholder="modern, velvet, comfortable, luxury"
                  />
                  <p style={{ 
                    fontSize: '0.75rem',
                    color: 'var(--stone-500)',
                    marginTop: 6,
                    fontFamily: 'Jost, sans-serif'
                  }}>
                    Add searchable keywords separated by commas
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  marginBottom: 20,
                  fontFamily: 'Jost, sans-serif'
                }}>
                  Specifications
                </h3>

                {/* Dimensions */}
                <div style={{ marginBottom: 20 }}>
                  <label className="field-label">Dimensions (cm)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                    <input
                      type="number"
                      value={formData.specifications.dimensions.length}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          dimensions: { ...formData.specifications.dimensions, length: e.target.value }
                        }
                      })}
                      className="field-input"
                      placeholder="Length"
                    />
                    <input
                      type="number"
                      value={formData.specifications.dimensions.width}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          dimensions: { ...formData.specifications.dimensions, width: e.target.value }
                        }
                      })}
                      className="field-input"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      value={formData.specifications.dimensions.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          dimensions: { ...formData.specifications.dimensions, height: e.target.value }
                        }
                      })}
                      className="field-input"
                      placeholder="Height"
                    />
                    <input
                      type="number"
                      value={formData.specifications.dimensions.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          dimensions: { ...formData.specifications.dimensions, weight: e.target.value }
                        }
                      })}
                      className="field-input"
                      placeholder="Weight (kg)"
                    />
                  </div>
                </div>

                {/* Material */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="field-label">Primary Material</label>
                      <input
                        type="text"
                        value={formData.specifications.material.primary}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            material: { ...formData.specifications.material, primary: e.target.value }
                          }
                        })}
                        className="field-input"
                        placeholder="e.g., Velvet"
                      />
                    </div>

                    <div>
                      <label className="field-label">Frame Material</label>
                      <input
                        type="text"
                        value={formData.specifications.material.frame}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            material: { ...formData.specifications.material, frame: e.target.value }
                          }
                        })}
                        className="field-input"
                        placeholder="e.g., Wood"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors & Styles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label className="field-label">Available Colors (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specifications.colors}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, colors: e.target.value }
                      })}
                      className="field-input"
                      placeholder="Grey, Beige, Blue"
                    />
                  </div>

                  <div>
                    <label className="field-label">Style (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specifications.style}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, style: e.target.value }
                      })}
                      className="field-input"
                      placeholder="Modern, Minimalist, Contemporary"
                    />
                  </div>
                </div>

                {/* Assembly & Other */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="field-label">Assembly Required</label>
                    <select
                      value={formData.specifications.assembly}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, assembly: e.target.value }
                      })}
                      className="field-input"
                    >
                      <option value="Required">Required</option>
                      <option value="Not Required">Not Required</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Assembly Time</label>
                    <input
                      type="text"
                      value={formData.specifications.assemblyTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, assemblyTime: e.target.value }
                      })}
                      className="field-input"
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                </div>

                {/* Space Efficient Checkbox */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.specifications.spaceEfficient}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, spaceEfficient: e.target.checked }
                      })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: '0.9rem', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)' }}>
                      Space-Efficient Design
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: 12, 
                justifyContent: 'flex-end',
                paddingTop: 24,
                borderTop: '1px solid var(--stone-200)'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    border: '1px solid var(--stone-300)',
                    color: 'var(--charcoal)',
                    fontSize: '0.9rem',
                    fontFamily: 'Jost, sans-serif',
                    cursor: 'pointer',
                    borderRadius: 2
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: 2
                  }}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;