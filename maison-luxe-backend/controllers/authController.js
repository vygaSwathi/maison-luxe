const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { normalizeString } = require('../utils/validation')

const register = async (req, res) => {
  try {
    const name = normalizeString(req.body?.name)
    const email = normalizeString(req.body?.email).toLowerCase()
    const password = String(req.body?.password || '')
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findByEmail(email)
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.json({ message: 'Registered successfully', user: { id: user._id, name, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message })
  }
}

const login = async (req, res) => {
  try {
    const email = normalizeString(req.body?.email).toLowerCase()
    const password = String(req.body?.password || '')
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const user = await User.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}

const logout = async (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', path: '/' })
  res.json({ message: 'Logged out' })
}

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json({ user })
}

module.exports = { register, login, logout, getMe }