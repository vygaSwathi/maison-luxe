import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function AdminPanel() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then(r => r.data),
  })
  
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders/all').then(r => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  })

  // Site settings
  const { data: settings = {} } = useQuery({ 
    queryKey: ['site-settings'], 
    queryFn: () => api.get('/settings').then(r => r.data) 
  })
  
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.put('/orders/notifications/seen').catch(() => {})
  }, [])
  
  const saveSettings = useMutation({ 
    mutationFn: (payload) => api.put('/settings', payload), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      setUploadProgress(0)
      setMessage('Hero video updated successfully.')
    },
    onError: (error) => {
      console.error('Save settings error:', error)
      setUploadProgress(0)
      setMessage(`Failed to save: ${error.response?.data?.message || 'Check console'}`)
    }
  })

  const handleVideoFile = async (file) => {
    if (!file) return
    
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v']
    const maxSize = 20 * 1024 * 1024
    
    if (!validTypes.includes(file.type)) {
      setMessage('Invalid file type. Please select MP4, WebM, OGG, MOV, or M4V.')
      return
    }
    
    if (file.size > maxSize) {
      setMessage(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size: 20MB`)
      return
    }

    setUploadingVideo(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('video', file)

      const response = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        },
        timeout: 60000
      })
      
      if (response.data.success) {
        await saveSettings.mutateAsync({ heroVideoUrl: response.data.url })
      } else {
        throw new Error(response.data.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload failed:', err)
      if (err.response?.status === 404) {
        setMessage('Upload endpoint not found. Make sure backend is running.')
      } else if (err.response?.data?.message) {
        setMessage(`Upload failed: ${err.response.data.message}`)
      } else {
        setMessage(`Upload failed: ${err.message}`)
      }
    } finally {
      setUploadingVideo(false)
    }
  }

  const removeHeroVideo = () => {
    if (confirm('Remove the current hero video?')) {
      saveSettings.mutate({ heroVideoUrl: '' })
    }
  }

  if (!user?.isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-black-eclat text-ivory p-8 pt-32">
      <h1 className="font-display text-5xl font-black text-gold mb-10">MAISON LUXE ADMIN</h1>
      {message && (
        <div className="mb-6 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
          {message}
        </div>
      )}
      {(productsLoading || ordersLoading) && (
        <div className="mb-6 text-muted-ivory">Loading dashboard data...</div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link to="/admin/products" className="p-6 rounded-2xl card-lux hover:scale-105 transition transform">
          <p className="text-gold text-lg font-bold mb-2">Manage Products</p>
          <p className="muted-ivory text-sm">Add, edit, or remove products</p>
        </Link>
        <Link to="/admin/tracking" className="p-6 rounded-2xl card-lux hover:scale-105 transition transform">
          <p className="text-gold text-lg font-bold mb-2">Manage Orders</p>
          <p className="muted-ivory text-sm">Update order status and tracking</p>
        </Link>
        <div className="p-6 rounded-2xl card-lux">
          <p className="text-gold text-lg font-bold mb-2">Statistics</p>
          <p className="text-3xl font-bold">{orders.length} Orders</p>
          <p className="text-xl">{products.length} Products</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl card-lux">
          <p className="muted-ivory">Total Orders</p>
          <p className="text-3xl">{orders?.length ?? 0}</p>
        </div>
        <div className="p-6 rounded-2xl card-lux">
          <p className="muted-ivory">Products</p>
          <p className="text-3xl">{products?.length ?? 0}</p>
        </div>
        <div className="p-6 rounded-2xl card-lux">
          <p className="muted-ivory">Hero Video</p>
          <p className="text-3xl">{settings.heroVideoUrl ? 'Set' : 'Not Set'}</p>
        </div>
      </div>

      {/* Hero Video Settings */}
      <div className="p-6 rounded-2xl card-lux mb-8">
        <h2 className="text-2xl mb-6">Hero Video Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-lg mb-3">Current Hero Video</h3>
          {settings.heroVideoUrl ? (
            <div className="space-y-3">
              <video 
                src={settings.heroVideoUrl} 
                className="w-full max-w-2xl h-64 object-cover rounded-md" 
                controls 
                preload="metadata"
              />
              <div className="flex gap-3 items-center">
                <p className="text-sm muted-ivory flex-1 truncate">{settings.heroVideoUrl}</p>
                <button 
                  onClick={removeHeroVideo}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm muted-ivory">No hero video set</p>
          )}
        </div>

        <div className="p-4 border border-white/10 rounded-lg">
          <h4 className="text-lg mb-3 text-gold">Upload New Hero Video</h4>
          <p className="text-sm muted-ivory mb-3">
            Max size: 20MB • Supported: MP4, WebM, OGG, MOV, M4V
          </p>
          
          <div className="space-y-3">
            <input 
              type="file" 
              accept="video/*" 
              onChange={e => handleVideoFile(e.target.files?.[0])} 
              disabled={uploadingVideo}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black-eclat hover:file:bg-yellow-500"
            />
            
            {uploadingVideo && (
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold"></div>
                  <span className="muted-ivory">Uploading... {uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 rounded-2xl card-lux">
        <h2 className="text-2xl mb-4">Recent Orders</h2>
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr key={o._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">{o._id.slice(-6)}</td>
                    <td className="p-3">{o.user?.email ?? '—'}</td>
                    <td className="p-3">${o.total}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={e => updateStatus.mutate({ id: o._id, status: e.target.value })}
                        className="bg-black/30 border border-white/20 text-white p-2 rounded text-sm"
                      >
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => 
                          <option key={s} value={s}>{s}</option>
                        )}
                      </select>
                    </td>
                    <td className="p-3">
                      <Link to="/admin/tracking" className="text-gold text-sm hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center muted-ivory py-8">No orders found</p>
        )}
      </div>
    </div>
  )
}