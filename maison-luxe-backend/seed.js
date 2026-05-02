require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Product = require('./models/Product')
const Settings = require('./models/Settings')

const sampleProducts = [
  {
    name: "Silk Evening Gown",
    basePriceUSD: 2890,
    description: "Elegant silk gown handcrafted for exclusive events",
    images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80"],
    category: "Clothes",
    type: "Dress",
    material: "Silk",
    color: "Black",
    gender: "Women",
    sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }]
  },
  {
    name: "Leather Tote Bag",
    basePriceUSD: 1250,
    description: "Premium leather bag for daily luxury",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"],
    category: "Bag",
    type: null,
    material: "Leather",
    color: "Tan",
    gender: "Women",
    sizes: [{ size: "One Size", stock: 10 }]
  },
  {
    name: "Diamond Necklace",
    basePriceUSD: 5200,
    description: "Real diamond pendant with 18k gold chain",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"],
    category: "Jewellery",
    type: "Necklace",
    material: "Gold",
    color: "Gold",
    gender: "Women",
    sizes: [{ size: "One Size", stock: 4 }]
  },
  {
    name: "Oud Perfume",
    basePriceUSD: 350,
    description: "Premium Arabian oud fragrance",
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"],
    category: "Perfume",
    type: "Fragrance",
    material: null,
    color: null,
    gender: "Unisex",
    sizes: [{ size: "50ml", stock: 15 }, { size: "100ml", stock: 8 }]
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('📦 Connected to Atlas')

    await User.deleteMany({})
    await Product.deleteMany({})
    await Settings.deleteMany({})
    console.log('🗑️  Cleared existing data')

    const hashedPassword = await bcrypt.hash('luxe123', 10)
    await User.create({
      name: 'Admin',
      email: 'admin@maisonluxe.com',
      password: hashedPassword,
      isAdmin: true
    })

    await Product.insertMany(sampleProducts)
    await Settings.create({
      heroVideoUrl: '',
      siteName: 'Maison Luxe',
      contactEmail: 'contact@maisonluxe.com'
    })

    console.log('✅ Seed complete')
    process.exit()
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()