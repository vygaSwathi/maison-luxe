const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, default: 10, min: 0 }
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePriceUSD: { type: Number, required: true, min: 1 },
  description: String,
  images: { type: [String], required: true },
  category: { type: String, enum: ['Clothes', 'Perfume', 'Bag', 'Jewellery'], required: true },
  type: { type: String, default: null },
  sizes: [sizeSchema],
  material: String,
  color: String,
  gender: { type: String, enum: ['Women', 'Men', 'Unisex'], default: 'Unisex' }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)