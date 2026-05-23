'use client'
import { useAuth } from '@/hooks/useAuth'
import { useListings } from '@/hooks/useListings'
import { useOffers } from '@/hooks/useOffers'
import { useMessages } from '@/hooks/useMessages'
import { formatPrice } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useMemo } from 'react'

export default function Dashboard() {
  const { user, authUser, loading } = useAuth()
  const { listings } = useListings()
  const { offers } = useOffers(authUser?.id ?? null)
  const { conversations } = useMessages(authUser?.id ?? null)

  const myListings = useMemo(
    () => listings.filter((l) => l.seller_id === authUser?.id),
    [listings, authUser]
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">Cargando...</div>
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Necesitás iniciar sesión</p>
        <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">Ingresar</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hola, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email} · {user.user_type}</p>
          </div>
          <Link href="/sell" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700">
            + Publicar auto
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Mis publicaciones', value: myListings.length, color: 'bg-blue-50 text-blue-600' },
            { label: 'Ofertas recibidas', value: offers.length, color: 'bg-green-50 text-green-600' },
            { label: 'Conversaciones', value: conversations.length, color: 'bg-purple-50 text-purple-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color.split(' ')[1]}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold">Mis publicaciones</h2>
            <Link href="/browse" className="text-sm text-blue-600">Ver todas →</Link>
          </div>
          {myListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No tenés publicaciones aún</p>
              <Link href="/sell" className="text-blue-600 text-sm font-semibold mt-2 block">Publicar mi primer auto</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {myListings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {listing.photo_urls?.[0] ? (
                      <img src={listing.photo_urls[0]} alt={listing.model} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-xl">🚗</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{listing.brand} {listing.model} {listing.year}</p>
                    <p className="text-sm text-gray-500">{listing.city} · {listing.odometer.toLocaleString()}km</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-blue-600">{formatPrice(listing.price)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {listing.status === 'active' ? 'Activo' : listing.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
