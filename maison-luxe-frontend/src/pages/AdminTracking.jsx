import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/api.js'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminTracking() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState(null)
  const [trackingData, setTrackingData] = useState({
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    currentLocation: ''
  })
  const [message, setMessage] = useState('')

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders/all').then(r => r.data)
  })

  useEffect(() => {
    api.put('/orders/notifications/seen').catch(() => {})
  }, [])

  const updateTrackingMutation = useMutation({
    mutationFn: ({ orderId, tracking }) => 
      api.put(`/orders/${orderId}/tracking`, { tracking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      setEditingId(null)
      setTrackingData({ carrier: '', trackingNumber: '', estimatedDelivery: '', currentLocation: '' })
      setMessage('Tracking updated successfully.')
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => 
      api.put(`/orders/${orderId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  })

  const handleSaveTracking = (orderId) => {
    if (!trackingData.carrier || !trackingData.trackingNumber) {
      setMessage('Please fill in carrier and tracking number.')
      return
    }
    updateTrackingMutation.mutate({
      orderId,
      tracking: {
        ...trackingData,
        lastUpdate: new Date()
      }
    })
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-[#0f1115] to-[#0b0b0f]">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-4xl font-bold text-gold mb-8">Order Tracking Management</h1>
        {message && (
          <div className="mb-4 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
            {message}
          </div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <p className="text-center text-muted-ivory py-20">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-ivory py-20">No orders found.</p>
          ) : (
            orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-lux rounded-xl p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-sm muted-ivory">{order.user?.email}</p>
                    <p className="text-sm muted-ivory">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => updateStatusMutation.mutate({ orderId: order._id, status: e.target.value })}
                    className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                      order.status === 'Delivered' ? 'bg-green-900 text-green-200' :
                      order.status === 'Shipped' ? 'bg-blue-900 text-blue-200' :
                      order.status === 'Processing' ? 'bg-yellow-900 text-yellow-200' :
                      order.status === 'Cancelled' ? 'bg-red-900 text-red-200' :
                      'bg-gray-700 text-white'
                    }`}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                {/* Items */}
                <div className="rounded p-4 mb-6 bg-white/5">
                  <h4 className="font-bold mb-3 text-gold">Items</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="text-sm flex justify-between">
                        <span className="text-muted-ivory">{item.productName} - Size: {item.size} × {item.qty}</span>
                        <span className="font-bold text-white">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-3 pt-2 border-t border-white/10">
                    <span className="font-bold text-gold">Total: ${order.total?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tracking Info */}
                {editingId === order._id ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded p-6 mb-4 space-y-4 bg-white/5">
                    <h4 className="font-bold text-gold">Update Tracking Information</h4>
                    <input
                      type="text"
                      placeholder="Carrier (e.g., FedEx, UPS, DHL)"
                      value={trackingData.carrier}
                      onChange={e => setTrackingData({...trackingData, carrier: e.target.value})}
                      className="w-full border rounded p-2 bg-transparent border-white/20 text-white placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingData.trackingNumber}
                      onChange={e => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                      className="w-full border rounded p-2 bg-transparent border-white/20 text-white placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Current Location (e.g., Chicago, IL)"
                      value={trackingData.currentLocation}
                      onChange={e => setTrackingData({...trackingData, currentLocation: e.target.value})}
                      className="w-full border rounded p-2 bg-transparent border-white/20 text-white placeholder:text-gray-500"
                    />
                    <input
                      type="date"
                      placeholder="Estimated Delivery"
                      value={trackingData.estimatedDelivery}
                      onChange={e => setTrackingData({...trackingData, estimatedDelivery: e.target.value})}
                      className="w-full border rounded p-2 bg-transparent border-white/20 text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveTracking(order._id)}
                        disabled={updateTrackingMutation.isPending}
                        className="bg-gold text-black px-4 py-2 rounded font-bold disabled:opacity-50 hover:bg-yellow-500 transition"
                      >
                        {updateTrackingMutation.isPending ? 'Saving...' : 'Save Tracking'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="border border-white/20 px-4 py-2 rounded text-muted-ivory hover:bg-white/10 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    {order.tracking?.trackingNumber ? (
                      <div className="bg-white/5 rounded p-4 mb-4">
                        <h4 className="font-bold mb-3 text-gold">Tracking Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Carrier</p>
                            <p className="font-bold text-white">{order.tracking.carrier}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Tracking Number</p>
                            <p className="font-bold text-gold">{order.tracking.trackingNumber}</p>
                          </div>
                          {order.tracking.currentLocation && (
                            <div>
                              <p className="text-gray-400">Current Location</p>
                              <p className="font-bold text-white">{order.tracking.currentLocation}</p>
                            </div>
                          )}
                          {order.tracking.estimatedDelivery && (
                            <div>
                              <p className="text-gray-400">Est. Delivery</p>
                              <p className="font-bold text-white">{new Date(order.tracking.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm mb-4">No tracking info yet</p>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(order._id)
                        setTrackingData(order.tracking || { carrier: '', trackingNumber: '', estimatedDelivery: '', currentLocation: '' })
                      }}
                      className="bg-white/10 text-white px-4 py-2 rounded font-bold hover:bg-white/20 transition"
                    >
                      {order.tracking?.trackingNumber ? 'Update Tracking' : 'Add Tracking'}
                    </button>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-bold mb-3 text-gold">Shipping Address</h4>
                    <div className="text-sm text-gray-300">
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                      <p>{order.shippingAddress.country}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}