'use client'
import { useMemo } from 'react'
import Navigation from '@/components/Navigation'
import ListingCard from '@/components/ListingCard'
import { useListings } from '@/hooks/useListings'
import { useMarketplaceStore } from '@/store/marketplace'
import { BYD_MODELS } from '@/lib/utils'

export default function Browse() {
  const { listings } = useListings()
  const { filters, setFilters } = useMarketplaceStore()

  const filtered = useMemo(() => {
    return listings
      .filter((l) => l.price >= filters.minPrice && l.price <= filters.maxPrice)
      .filter((l) => !filters.model || l.model === filters.model)
      .filter((l) => !filters.city || l.city.toLowerCase().includes(filters.city.toLowerCase()))
      .sort((a, b) => {
        if (filters.sortBy === 'cheapest') return a.price - b.price
        if (filters.sortBy === 'expensive') return b.price - a.price
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [listings, filters])

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Buscar BYDs en Argentina</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Modelo</label>
              <select value={filters.model} onChange={(e) => setFilters({ model: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-sm">
                <option value="">Todos</option>
                {BYD_MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Precio mín</label>
              <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ minPrice: +e.target.value })} className="w-full border rounded-lg px-2 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Precio máx</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: +e.target.value })} className="w-full border rounded-lg px-2 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Ciudad</label>
              <input type="text" value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} placeholder="Córdoba..." className="w-full border rounded-lg px-2 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Ordenar</label>
              <select value={filters.sortBy} onChange={(e) => setFilters({ sortBy: e.target.value as 'newest' | 'cheapest' | 'expensive' })} className="w-full border rounded-lg px-2 py-2 text-sm">
                <option value="newest">Más reciente</option>
                <option value="cheapest">Más barato</option>
                <option value="expensive">Más caro</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} auto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-gray-500 text-lg">No hay autos disponibles con esos filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}
