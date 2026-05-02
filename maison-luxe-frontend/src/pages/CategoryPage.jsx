import { useParams, Link } from 'react-router-dom'

export default function CategoryPage() {
  const { category } = useParams()
  const label = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full card-lux rounded-2xl p-8 text-center">
        <h1 className="font-display text-3xl text-gold mb-3">{label}</h1>
        <p className="muted-ivory mb-6">
          Category-specific page is coming soon. Use full collection meanwhile.
        </p>
        <Link to="/collection/all" className="btn-gold px-6 py-3 rounded-lg inline-block">
          Browse Collection
        </Link>
      </div>
    </div>
  )
}
