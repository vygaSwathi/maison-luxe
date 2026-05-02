require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

const createApp = () => {
  const app = express()
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

  // Middleware
  app.use(cookieParser())
  app.use(cors({
    origin: allowedOrigin,
    credentials: true
  }))
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  // Routes
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/products', require('./routes/products'))
  app.use('/api/orders', require('./routes/orders'))
  app.use('/api/settings', require('./routes/settings'))
  app.use('/api/upload', require('./routes/upload'))

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Maison Luxe API running' })
  })

  app.get('/', (req, res) => {
    res.send('Maison Luxe API — Running')
  })

  return app
}

const startServer = async () => {
  const PORT = process.env.PORT || 5000
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB Atlas Connected')
  const app = createApp()
  app.listen(PORT, () => {
    console.log(`🚀 Maison Luxe Backend running on http://localhost:${PORT}`)
  })
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message)
    process.exit(1)
  })
}

module.exports = { createApp }