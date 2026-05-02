import { Link } from 'react-router-dom'

export default function SearchCollectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full card-lux rounded-2xl p-8 text-center">
        <h1 className="font-display text-3xl text-gold mb-3">Search Collection</h1>
        <p className="muted-ivory mb-6">
          Search is coming soon. Browse the full collection for now.
        </p>
        <Link to="/collection/all" className="btn-gold px-6 py-3 rounded-lg inline-block">
          View All Products
        </Link>
      </div>
    </div>
  )
}
