const express = require('express')
const Order = require('../models/Order')
const { protect, admin } = require('../middleware/auth')
const { isPositiveNumber, isNonEmptyString, isValidObjectId } = require('../utils/validation')

const router = express.Router()
const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all orders (admin only)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get unseen pending order notifications (admin only)
router.get('/notifications', protect, admin, async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending', adminSeen: false })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Mark pending notifications as seen (admin only)
router.put('/notifications/seen', protect, admin, async (req, res) => {
  try {
    await Order.updateMany({ status: 'Pending', adminSeen: false }, { $set: { adminSeen: true } })
    res.json({ message: 'Notifications marked as seen' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : []
    const shipping = req.body?.shippingAddress || {}
    if (items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' })
    }
    if (!isPositiveNumber(req.body?.total)) {
      return res.status(400).json({ message: 'Order total must be a positive number' })
    }
    if (!isNonEmptyString(shipping.fullName) || !isNonEmptyString(shipping.address) || !isNonEmptyString(shipping.city)) {
      return res.status(400).json({ message: 'Shipping full name, address and city are required' })
    }
    const order = await Order.create({ ...req.body, user: req.user._id, adminSeen: false })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' })
    }
    if (!validStatuses.includes(req.body?.status)) {
      return res.status(400).json({ message: 'Invalid order status' })
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update tracking (admin only)
router.put('/:id/tracking', protect, admin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' })
    }
    if (!isNonEmptyString(req.body?.tracking?.carrier) || !isNonEmptyString(req.body?.tracking?.trackingNumber)) {
      return res.status(400).json({ message: 'Carrier and tracking number are required' })
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { tracking: req.body.tracking }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router