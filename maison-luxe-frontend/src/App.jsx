import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import CollectionPage from './pages/CollectionPage'
import AllCollectionPage from './pages/AllCollectionPage'
import SearchCollectionPage from './pages/SearchCollectionPage'
import CategoryPage from './pages/CategoryPage'
import AdminPanel from './pages/AdminPanel'
import AdminProducts from './pages/AdminProducts'
import AdminTracking from './pages/AdminTracking'
import { useAuth } from './context/AuthContext'

function Layout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collection/:gender" element={<CollectionPage />} />
          <Route path="/collection/all" element={<AllCollectionPage />} />
          <Route path="/search" element={<SearchCollectionPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />

          {/* Protected routes */}
          <Route path="/checkout" element={user ? <Checkout /> : <Login />} />
          <Route path="/my-orders" element={user ? <MyOrders /> : <Login />} />

          {/* Admin routes */}
          <Route path="/admin" element={user?.isAdmin ? <AdminPanel /> : <Login />} />
          <Route path="/admin/products" element={user?.isAdmin ? <AdminProducts /> : <Login />} />
          <Route path="/admin/tracking" element={user?.isAdmin ? <AdminTracking /> : <Login />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App