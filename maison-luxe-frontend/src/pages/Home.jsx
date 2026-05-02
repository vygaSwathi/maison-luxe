import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../api/api.js'

export default function Home() {
  const { data: settings = {} } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  const heroVideoUrl = settings?.heroVideoUrl || ''
  const categories = [
    {
      name: 'Clothes',
      slug: 'clothes',
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Perfume',
      slug: 'perfume',
      image:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Bag',
      slug: 'bag',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Jewellery',
      slug: 'jewellery',
      image:
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1115] to-[#0b0b0f]">
        {heroVideoUrl && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 font-display text-7xl sm:text-8xl lg:text-9xl font-black text-gold mb-6"
          >
            MAISON LUXE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative z-10 text-xl text-muted-ivory mb-8 tracking-wide"
          >
            Where Elegance Meets Excellence
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10"
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
      <section className="h-screen px-6 py-16 max-w-7xl mx-auto flex flex-col justify-center">
        <h2 className="text-3xl font-display text-center text-gold mb-8">Shop by Category</h2>
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative card-lux rounded-2xl overflow-hidden text-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.location.href = `/collection/${cat.slug}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <h3 className="text-2xl font-display text-gold mb-2">{cat.name}</h3>
                <p className="text-muted-ivory text-sm">Discover {cat.slug} collection</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}