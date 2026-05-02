import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1115] to-[#0b0b0f]">
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-display text-7xl sm:text-8xl lg:text-9xl font-black text-gold mb-6"
          >
            MAISON LUXE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-muted-ivory mb-8 tracking-wide"
          >
            Where Elegance Meets Excellence
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/collection/women"
              className="btn-gold px-8 py-4 rounded-full text-lg inline-block"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-display text-center text-gold mb-16">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {['Clothes', 'Perfume', 'Bag', 'Jewellery'].map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-lux rounded-2xl p-8 text-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.location.href = `/collection/${cat.toLowerCase()}`}
            >
              <h3 className="text-2xl font-display text-gold mb-3">{cat}</h3>
              <p className="text-muted-ivory text-sm">Discover {cat.toLowerCase()} collection</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}