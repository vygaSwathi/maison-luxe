import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'  // ← ADD THIS
import api from '../api/api'

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatPrice, region } = useRegion()  // ← ADD region
  const [loading, setLoading] = useState(false)
  
  // Map region to default country
  const getDefaultCountry = () => {
    switch(region) {
      case 'EU': return 'France'
      case 'UK': return 'United Kingdom'
      case 'JP': return 'Japan'
      default: return 'USA'
    }
  }

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: getDefaultCountry()  // ← Auto-set based on currency
  })

  // Update country when currency region changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      country: getDefaultCountry()
    }))
  }, [region])  // ← Runs when user switches currency

  // Rest of your code remains the same...
  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          productName: item.product.name,
          size: item.size,
          qty: item.qty,
          price: item.product.basePriceUSD,
          image: item.product.images?.[0] || ''
        })),
        total: getTotal(),
        shippingAddress: formData
      }
      await api.post('/orders', orderData)
      clearCart()
      alert('Order placed successfully!')
      navigate('/my-orders')
    } catch (err) {
      alert('Failed to place order: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Rest of your JSX remains the same...
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gold text-center mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="card-lux rounded-2xl p-8 space-y-4">
            <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 input-surface rounded-lg" required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 input-surface rounded-lg" required />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 input-surface rounded-lg" required />
            <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 input-surface rounded-lg" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="p-3 input-surface rounded-lg" required />
              <input type="text" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="p-3 input-surface rounded-lg" required />
              <input type="text" placeholder="ZIP" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="p-3 input-surface rounded-lg" required />
              {/* Country field now auto-updates with currency */}
              <input type="text" placeholder="Country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="p-3 input-surface rounded-lg" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-gold py-3 rounded-lg">
              {loading ? 'Processing...' : `Place Order — ${formatPrice(getTotal())}`}
            </button>
          </form>

          <div className="card-lux rounded-2xl p-8 h-fit">
            <h2 className="font-display text-2xl font-bold text-gold mb-6">Order Summary</h2>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-3">
                <span>{item.product.name} x{item.qty}</span>
                <span>{formatPrice(item.product.basePriceUSD * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}