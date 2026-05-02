const express = require('express')
const Product = require('../models/Product')
const { protect, admin } = require('../middleware/auth')
const { isNonEmptyString, isPositiveNumber, isValidObjectId } = require('../utils/validation')

const router = express.Router()

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' })
    }
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create product (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    if (!isNonEmptyString(req.body?.name)) {
      return res.status(400).json({ message: 'Product name is required' })
    }
    if (!isPositiveNumber(req.body?.basePriceUSD)) {
      return res.status(400).json({ message: 'basePriceUSD must be a positive number' })
    }
    if (!Array.isArray(req.body?.images) || req.body.images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' })
    }
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update product (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' })
    }
    if (req.body?.basePriceUSD !== undefined && !isPositiveNumber(req.body.basePriceUSD)) {
      return res.status(400).json({ message: 'basePriceUSD must be a positive number' })
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' })
    }
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router