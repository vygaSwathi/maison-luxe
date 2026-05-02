import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'  // ← ADD THIS

export default function Cart() {
  const { cart, removeFromCart, updateQty, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatPrice } = useRegion()  // ← ADD THIS

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="font-display text-4xl font-bold text-gold mb-4">Your Cart is Empty</h1>
        <button onClick={() => navigate('/')} className="btn-gold px-8 py-3 rounded-lg">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="card-lux rounded-2xl p-6 flex gap-6">
                <img src={item.product.images?.[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{item.product.name}</h3>
                  <p className="text-muted-ivory">Size: {item.size}</p>
                  {/* ✅ FIXED - Individual item price */}
                  <p className="text-gold font-bold">{formatPrice(item.product.basePriceUSD)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => updateQty(item.product._id, item.size, item.qty - 1)} className="w-8 h-8 rounded-full border border-white/20">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.product._id, item.size, item.qty + 1)} className="w-8 h-8 rounded-full border border-white/20">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product._id, item.size)} className="text-red-500 text-sm">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-red-500 text-sm mt-4">Clear Cart</button>
          </div>

          <div className="card-lux rounded-2xl p-6 h-fit">
            <h2 className="font-display text-2xl font-bold text-gold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              {/* ✅ FIXED - Subtotal */}
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl mb-6">
              <span>Total</span>
              {/* ✅ FIXED - Total */}
              <span>{formatPrice(getTotal())}</span>
            </div>
            <button onClick={() => user ? navigate('/checkout') : navigate('/login')} className="w-full btn-gold py-3 rounded-lg">
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}