import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('maison_luxe_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setCart(parsed)
      } catch {
        localStorage.removeItem('maison_luxe_cart')
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('maison_luxe_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  const addToCart = (product, size, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id && item.size === size)
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        )
      }
      return [...prev, { product, size, qty }]
    })
  }

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.product._id === productId && item.size === size)))
  }

  const updateQty = (productId, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size)
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product._id === productId && item.size === size ? { ...item, qty } : item
        )
      )
    }
  }

  const clearCart = () => setCart([])

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.basePriceUSD * item.qty), 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
