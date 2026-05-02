const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    size: String,
    qty: Number,
    price: Number,
    image: String
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  adminSeen: { type: Boolean, default: false },
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    currentLocation: String,
    lastUpdate: Date
  },
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)