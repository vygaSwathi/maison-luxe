import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../api/api'
import { useCart } from '../context/CartContext'
import { useRegion } from '../context/RegionContext'  // ← ADD THIS
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { formatPrice } = useRegion()  // ← ADD THIS
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)

  const productFromState = location.state?.product
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
    enabled: !productFromState,
    initialData: productFromState
  })

  const handleAddToCart = () => {
    const size = selectedSize || (product?.sizes?.[0]?.size || 'One Size')
    addToCart(product, size, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-gold hover:underline mb-8 inline-block">
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="card-lux rounded-2xl overflow-hidden">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold text-gold mb-4">{product.name}</h1>
            {/* ✅ FIXED - Single price */}
            <p className="text-3xl font-bold mb-6">{formatPrice(product.basePriceUSD)}</p>
            <p className="text-muted-ivory mb-6">{product.description || 'No description available'}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map(s => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 rounded-lg border transition ${selectedSize === s.size ? 'border-gold bg-gold/20 text-gold' : 'border-white/20 hover:border-gold'}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full border border-white/20">-</button>
              <span className="text-xl font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full border border-white/20">+</button>
            </div>

            {/* ✅ FIXED - Add to Cart button with formatted price */}
            <button onClick={handleAddToCart} className="w-full btn-gold py-4 rounded-lg">
              {added ? '✓ Added to Cart' : `Add to Cart — ${formatPrice(product.basePriceUSD * qty)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}