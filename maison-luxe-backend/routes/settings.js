const express = require('express')
const Settings = require('../models/Settings')
const { protect, admin } = require('../middleware/auth')
const { isValidUrlOrEmpty } = require('../utils/validation')

const router = express.Router()

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update settings (admin only)
router.put('/', protect, admin, async (req, res) => {
  try {
    if (!isValidUrlOrEmpty(req.body?.heroVideoUrl)) {
      return res.status(400).json({ message: 'heroVideoUrl must be a valid http/https URL' })
    }
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }
    Object.assign(settings, req.body)
    await settings.save()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router