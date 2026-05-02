import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import { motion } from 'framer-motion'
import { useRegion } from '../context/RegionContext'  // ← ADD THIS

export default function CollectionPage() {
  const { gender } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useRegion()  // ← ADD THIS

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data)
  })

  const filtered = products.filter(p => 
    p.gender?.toLowerCase() === gender?.toLowerCase() ||
    p.category?.toLowerCase() === gender?.toLowerCase()
  )

  const title = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Collection'

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gold text-lg mb-6 hover:text-gold-dark transition flex items-center gap-2"
        >
          ← Back to Home
        </button>
        <h1 className="font-display text-5xl font-bold text-gold text-center mb-4">{title}</h1>
        <p className="text-center text-muted-ivory mb-12">Discover our luxury {gender} collection</p>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-ivory">No products found in this collection.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-lux rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
              >
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2">{product.name}</h3>
                  {/* ✅ FIXED - Now uses formatPrice */}
                  <p className="text-gold text-lg font-bold">{formatPrice(product.basePriceUSD)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}