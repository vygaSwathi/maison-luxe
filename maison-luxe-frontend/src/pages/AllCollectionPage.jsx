import { useQuery } from '@tanstack/react-query'
import api from '../api/api.js'
import { useRegion } from '../context/RegionContext.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AllCollectionPage() {
  const { formatPrice } = useRegion()
  const navigate = useNavigate()

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data)
  })

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1509631179647-0171e475d736?auto=format&fit=crop&w=400&q=80"
    if (imagePath.startsWith('http')) return imagePath
    return `http://localhost:5000${imagePath}`
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0f1115] to-[#0b0b0f] py-20">
      {/* Header Section */}
      <div className="text-center mb-16">
        <button 
          onClick={() => navigate('/')}
          className="text-gold text-lg mb-8 hover:text-gold-dark transition flex items-center gap-2 mx-auto"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-6xl font-bold mb-6 text-gold">MAISON LUXE</h1>
        <h2 className="text-4xl font-light text-white mb-4">
          Complete Collection
        </h2>
        <p className="text-muted-ivory text-lg">All Luxury Pieces</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-32 text-white">
          <p className="text-2xl mb-8">No products available.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-gold underline text-lg hover:text-gold-dark transition"
          >
            Return to Home
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-500 border border-gold/20"
                onClick={() => navigate(`/product/${p._id}`, { state: { product: p } })}
              >
                {/* Image Container */}
                <div className="h-80 relative overflow-hidden bg-black">
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                  <p className="text-muted-ivory text-sm mb-3 capitalize">{p.category}</p>
                  <p className="text-2xl font-bold text-gold">{formatPrice(p.basePriceUSD)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-ivory">
          <p className="text-sm">© 2025 MAISON LUXE. Luxury fashion for the modern individual.</p>
        </div>
      </footer>
    </div>
  )
}