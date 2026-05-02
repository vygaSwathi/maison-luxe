const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
})

// Upload video (admin only)
router.post('/video', protect, admin, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const url = `http://localhost:5000/uploads/${req.file.filename}`
    res.json({ success: true, url, filename: req.file.filename })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Upload image (admin only)
router.post('/image', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const url = `http://localhost:5000/uploads/${req.file.filename}`
    res.json({ success: true, url })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router