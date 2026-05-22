'use client';

import { useListings } from '@/hooks/useListings';
import { useMarketplaceStore } from '@/store/marketplace';
import ListingCard from '@/components/ListingCard';
import { useMemo } from 'react';
import Link from 'next/link';

const BYD_MODELS = ['Seagull', 'Yuan Plus', 'Song', 'Atto 3'];

export default function Browse() {
  const { listings } = useListings();
  const { filters, setFilters } = useMarketplaceStore();

  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.status === 'active')
      .filter((l) => l.price >= filters.minPrice && l.price <= filters.maxPrice)
      .filter((l) => !filters.model || l.carData.model === filters.model)
      .filter((l) => !filters.city || l.carData.city.includes(filters.city))
      .sort((a, b) => {
        if (filters.sortBy === 'newest') return b.createdAt - a.createdAt;
        if (filters.sortBy === 'cheapest') return a.price - b.price;
        if (filters.sortBy === 'expensive') return b.price - a.price;
        return 0;
      });
  }, [listings, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VendeBYD
          </Link>
          <div className="flex gap-4">
            <Link href="/browse" className="text-blue-600 font-semibold">
              Buscar
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600">
              Vender
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Busca tu BYD ideal</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold mb-2">Precio mín (ARS)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Precio máx (ARS)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Modelo</label>
              <select
                value={filters.model}
                onChange={(e) => setFilters({ model: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todos</option>
                {BYD_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="newest">Más reciente</option>
                <option value="cheapest">Más barato</option>
                <option value="expensive">Más caro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay autos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
