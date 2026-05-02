import { useQuery } from '@tanstack/react-query'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function MyOrders() {
  const { user } = useAuth()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(r => r.data),
    enabled: !!user
  })

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view orders</div>
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gold text-center mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-muted-ivory">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="card-lux rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-ivory">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-muted-ivory">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-900 text-green-200' : 'bg-gold/20 text-gold'}`}>
                    {order.status}
                  </span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-t border-white/10">
                    <span>{item.productName} x{item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-4 border-t border-white/10 mt-2">
                  <span>Total</span>
                  <span className="text-gold">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}