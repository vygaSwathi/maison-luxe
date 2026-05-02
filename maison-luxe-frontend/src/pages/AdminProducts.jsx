import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/api.js'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    basePriceUSD: '',
    description: '',
    category: '',
    type: '',
    material: '',
    color: '',
    gender: '',
    images: [],
    sizes: [],
    _newImage: ''
  })

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then(r => r.data),
    retry: 1
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      resetForm()
      alert('Product created!')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      resetForm()
      alert('Product updated!')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      alert('Product deleted!')
    }
  })

  const resetForm = () => {
    setFormData({
      name: '', basePriceUSD: '', description: '', category: '', type: '',
      material: '', color: '', gender: '', images: [], sizes: [], _newImage: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  // Image upload
  const uploadFile = async (file) => {
    if (!file) return null
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large (max 10MB)')
      return null
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data?.url || null
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { _newImage, ...data } = formData

    if (!data.name?.trim()) return alert('Name is required')
    if (!data.category?.trim()) return alert('Category is required')
    if (!data.images?.length) return alert('Add at least one image')

    const price = parseInt(data.basePriceUSD, 10)
    if (isNaN(price) || price < 1) return alert('Valid price required')

    const payload = {
      ...data,
      basePriceUSD: price,
      images: data.images.filter(Boolean),
      sizes: data.sizes.length > 0 ? data.sizes : [{ size: 'One Size', stock: 10 }]
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
    } catch (err) {
      console.error('Save error:', err)
      alert(`Save failed: ${err.response?.data?.message || 'Check console'}`)
    }
  }

  if (isLoading) return <div className="pt-32 text-center text-white">Loading products...</div>
  if (error) return <div className="pt-32 text-center text-red-500">Error: {error.message}</div>

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-[#0f1115] to-[#0b0b0f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gold">Manage Products</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
          >
            + Add Product
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-lux rounded-xl p-8 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (USD) *"
                  value={formData.basePriceUSD}
                  onChange={e => setFormData({ ...formData, basePriceUSD: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                  required
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full input-surface border rounded-lg p-3"
                rows={3}
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Category * (Clothes, Perfume, Bag, Jewellery)"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Type (Dress, Jacket, etc.)"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Material"
                  value={formData.material}
                  onChange={e => setFormData({ ...formData, material: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Color"
                  value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                />
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="input-surface border rounded-lg p-3"
                >
                  <option value="">Select Gender</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    value={formData._newImage}
                    onChange={e => setFormData({ ...formData, _newImage: e.target.value })}
                    className="flex-1 input-surface border rounded-lg p-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData._newImage?.trim()) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, formData._newImage.trim()],
                          _newImage: ''
                        })
                      }
                    }}
                    className="bg-gold text-black px-5 rounded-lg font-bold"
                  >
                    Add URL
                  </button>
                </div>

                <div>
                  <label className="block mb-2 text-muted-ivory">Or upload image file</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const url = await uploadFile(file)
                      if (url) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, url]
                        }))
                      }
                      e.target.value = ''
                    }}
                    className="text-muted-ivory"
                  />
                  {uploading && <span className="ml-3 text-sm text-gold">Uploading...</span>}
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border border-white/20" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, idx) => idx !== i)
                        }))}
                        className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gold text-black px-8 py-3 rounded-lg font-bold disabled:opacity-60 hover:bg-yellow-500 transition"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
                </button>
                <button type="button" onClick={resetForm} className="border border-white/20 px-8 py-3 rounded-lg hover:bg-white/10 transition">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products Table */}
        <div className="card-lux rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 text-gold">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Gender</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded" />
                        )}
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gold font-bold">${p.basePriceUSD}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">{p.gender || '—'}</td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => {
                          setEditingId(p._id)
                          setFormData({
                            name: p.name || '',
                            basePriceUSD: p.basePriceUSD || '',
                            description: p.description || '',
                            category: p.category || '',
                            type: p.type || '',
                            material: p.material || '',
                            color: p.color || '',
                            gender: p.gender || '',
                            images: p.images || [],
                            sizes: p.sizes || [],
                            _newImage: ''
                          })
                          setShowForm(true)
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this product?')) {
                            deleteMutation.mutate(p._id)
                          }
                        }}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}