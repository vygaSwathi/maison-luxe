import { useRegion } from '../context/RegionContext'

export default function RegionSelector() {
  const { region, setRegion, regions } = useRegion()

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm font-medium hover:text-gold transition">
        {regions[region]?.symbol} {region}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-black/95 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-white/10">
        {Object.entries(regions).map(([code, r]) => (
          <button
            key={code}
            onClick={() => setRegion(code)}
            className={`block w-full text-left px-4 py-2 text-sm ${region === code ? 'bg-gold/20 text-gold font-semibold' : 'text-muted-ivory hover:bg-gold/10'}`}
          >
            {r.name} ({r.symbol} {r.currency})
          </button>
        ))}
      </div>
    </div>
  )
}