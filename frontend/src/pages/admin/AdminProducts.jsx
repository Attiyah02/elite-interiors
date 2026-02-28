import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: '', description: '', category: '', subcategory: '',
    price: '', costPrice: '', discount: 0,
    specifications: {
      dimensions: { length: '', width: '', height: '', weight: '' },
      material: { primary: '', frame: '', filling: '' },
      seatingCapacity: '',
      colors: '',
      assembly: '',
      assemblyTime: '',
      spaceEfficient: false,
      style: ''
    },
    images: '',
    tags: '',
    roomType: '',
    inStock: true
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      price: product.price || '',
      costPrice: product.costPrice || '',
      discount: product.discount || 0,
      specifications: {
        dimensions: {
          length: product.specifications?.dimensions?.length || '',
          width: product.specifications?.dimensions?.width || '',
          height: product.specifications?.dimensions?.height || '',
          weight: product.specifications?.dimensions?.weight || ''
        },
        material: {
          primary: product.specifications?.material?.primary || '',
          frame: product.specifications?.material?.frame || '',
          filling: product.specifications?.material?.filling || ''
        },
        seatingCapacity: product.specifications?.seatingCapacity || '',
        colors: product.specifications?.colors?.join(', ') || '',
        assembly: product.specifications?.assembly || '',
        assemblyTime: product.specifications?.assemblyTime || '',
        spaceEfficient: product.specifications?.spaceEfficient || false,
        style: product.specifications?.style?.join(', ') || ''
      },
      images: product.images?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
      roomType: product.roomType || '',
      inStock: product.inStock !== false
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        costPrice: Number(form.costPrice),
        discount: Number(form.discount),
        specifications: {
          ...form.specifications,
          dimensions: {
            length: Number(form.specifications.dimensions.length),
            width: Number(form.specifications.dimensions.width),
            height: Number(form.specifications.dimensions.height),
            weight: Number(form.specifications.dimensions.weight)
          },
          seatingCapacity: Number(form.specifications.seatingCapacity) || undefined,
          colors: form.specifications.colors.split(',').map(c => c.trim()).filter(Boolean),
          style: form.specifications.style.split(',').map(s => s.trim()).filter(Boolean),
        },
        images: form.images.split(',').map(i => i.trim()).filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
      } else {
        await productsAPI.create(productData);
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving product. Check all fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productsAPI.delete(productId);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-amber-700 transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Product</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Category</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Cost</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Sales</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Views</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.tags?.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-amber-600">R {product.price?.toLocaleString()}</p>
                    {product.discount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    R {product.costPrice?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">{product.salesCount}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Basic Info */}
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="e.g. Compact Oslo Sofa"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows="3"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      placeholder="Describe the product..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="e.g. Sofas"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="4999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (R) *</label>
                    <input
                      type="number"
                      value={form.costPrice}
                      onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Dimensions (cm)</h3>
                <div className="grid grid-cols-4 gap-4">
                  {['length', 'width', 'height', 'weight'].map(dim => (
                    <div key={dim}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {dim} {dim === 'weight' ? '(kg)' : '(cm)'}
                      </label>
                      <input
                        type="number"
                        value={form.specifications.dimensions[dim]}
                        onChange={(e) => setForm({
                          ...form,
                          specifications: {
                            ...form.specifications,
                            dimensions: {
                              ...form.specifications.dimensions,
                              [dim]: e.target.value
                            }
                          }
                        })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Materials</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'primary', label: 'Primary Material' },
                    { key: 'frame', label: 'Frame Material' },
                    { key: 'filling', label: 'Filling' }
                  ].map(mat => (
                    <div key={mat.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{mat.label}</label>
                      <input
                        type="text"
                        value={form.specifications.material[mat.key]}
                        onChange={(e) => setForm({
                          ...form,
                          specifications: {
                            ...form.specifications,
                            material: {
                              ...form.specifications.material,
                              [mat.key]: e.target.value
                            }
                          }
                        })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder={`e.g. ${mat.key === 'primary' ? 'Linen Fabric' : mat.key === 'frame' ? 'Solid Pine' : 'Foam'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Specs */}
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Other Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.specifications.colors}
                      onChange={(e) => setForm({
                        ...form,
                        specifications: { ...form.specifications, colors: e.target.value }
                      })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Grey, Beige, Navy Blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.specifications.style}
                      onChange={(e) => setForm({
                        ...form,
                        specifications: { ...form.specifications, style: e.target.value }
                      })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Modern, Minimalist"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assembly Time</label>
                    <input
                      type="text"
                      value={form.specifications.assemblyTime}
                      onChange={(e) => setForm({
                        ...form,
                        specifications: { ...form.specifications, assemblyTime: e.target.value }
                      })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="45 minutes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                    <input
                      type="number"
                      value={form.specifications.seatingCapacity}
                      onChange={(e) => setForm({
                        ...form,
                        specifications: { ...form.specifications, seatingCapacity: e.target.value }
                      })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="3"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="compact, modern, grey, small-space"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URLs (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.images}
                      onChange={(e) => setForm({ ...form, images: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={form.specifications.spaceEfficient}
                        onChange={(e) => setForm({
                          ...form,
                          specifications: { ...form.specifications, spaceEfficient: e.target.checked }
                        })}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Space Efficient</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;