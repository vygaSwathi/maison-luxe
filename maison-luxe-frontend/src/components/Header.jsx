import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import RegionSelector from './RegionSelector'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/api.js'

export default function Header() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: notifications } = useQuery({
    queryKey: ['admin-order-notifications'],
    queryFn: () => api.get('/orders/notifications').then(r => r.data),
    enabled: !!user?.isAdmin,
    refetchInterval: 10000,
  })
  const markSeen = useMutation({
    mutationFn: () => api.put('/orders/notifications/seen'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-order-notifications'] }),
  })
  const pendingOrdersCount = Number(notifications?.count || 0)
  const handleAdminNav = (path) => {
    if (pendingOrdersCount > 0) markSeen.mutate()
    navigate(path)
  }

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="font-display text-3xl font-black tracking-wider text-gold">
          MAISON LUXE
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/collection/women" className="text-sm font-medium hover:text-gold transition">
            Women
          </Link>
          <Link to="/collection/men" className="text-sm font-medium hover:text-gold transition">
            Men
          </Link>
          <Link to="/collection/all" className="text-sm font-medium hover:text-gold transition">
            All
          </Link>
          
          <RegionSelector />

          <Link to="/cart" className="text-sm font-medium hover:text-gold transition relative">
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {user?.isAdmin && (
            <div className="relative group">
              <button className="text-sm font-medium hover:text-gold transition relative pr-5">
                Admin ▼
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-black/95 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-white/10">
                <button onClick={() => handleAdminNav('/admin')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gold/20">Dashboard</button>
                <button onClick={() => handleAdminNav('/admin/products')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gold/20">Products</button>
                <button onClick={() => handleAdminNav('/admin/tracking')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gold/20">
                  Orders {pendingOrdersCount > 0 ? `(${pendingOrdersCount})` : ''}
                </button>
              </div>
            </div>
          )}

          {user ? (
            <>
              <Link to="/my-orders" className="text-sm font-medium hover:text-gold">Orders</Link>
              <button onClick={logout} className="text-sm font-medium hover:text-gold">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-gold">Login</Link>
              <Link to="/register" className="text-sm font-medium hover:text-gold">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}