import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/api.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('jwt')
      if (token) {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.user)
        } catch (err) {
          localStorage.removeItem('jwt')
          setUser(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    if (res.data.token) {
      localStorage.setItem('jwt', res.data.token)
    }
    setUser(res.data.user)
    return res.data.user
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('jwt', res.data.token)
    }
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('jwt')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)