
import { createContext, useState, useContext, useEffect } from 'react'

const RegionContext = createContext()

const regions = {
  US: { name: 'United States', currency: 'USD', symbol: '$', tax: 0, rate: 1.0 },
  EU: { name: 'Europe', currency: 'EUR', symbol: '€', tax: 0.20, rate: 0.92 },
  UK: { name: 'United Kingdom', currency: 'GBP', symbol: '£', tax: 0.20, rate: 0.78 },
  JP: { name: 'Japan', currency: 'JPY', symbol: '¥', tax: 0.10, rate: 145 },
}

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(() => localStorage.getItem('maison_luxe_region') || 'US')

  useEffect(() => {
    localStorage.setItem('maison_luxe_region', region)
  }, [region])

  const formatPrice = (usd) => {
    const r = regions[region]
    const withTax = usd * r.rate * (1 + r.tax)
    const decimals = region === 'JP' ? 0 : 2
    return `${r.symbol}${withTax.toFixed(decimals)}`
  }

  return (
    <RegionContext.Provider value={{ region, setRegion, regions, formatPrice }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => useContext(RegionContext)