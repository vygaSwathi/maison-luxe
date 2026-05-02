const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  heroVideoUrl: { type: String, default: '' },
  siteName: { type: String, default: 'Maison Luxe' },
  contactEmail: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Settings', settingsSchema)