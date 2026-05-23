'use client'
import { Listing } from '@/lib/types'
import { formatPrice, conditionLabel } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

export default function ListingCard({ listing }: { listing: Listing }) {
  const [fav, setFav] = useState(false)
  const age = new Date().getFullYear() - listing.year

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
          {listing.photo_urls?.[0] ? (
            <img src={listing.photo_urls[0]} alt={listing.model} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🚗</div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setFav(!fav) }}
            className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-base"
          >
            {fav ? '❤️' : '🤍'}
          </button>
          {listing.verification_status === 'verified' && (
            <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              ✓ Verificado
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-lg leading-tight">{listing.brand} {listing.model}</h3>
          <p className="text-sm text-gray-500 mt-1 mb-3">{listing.year} · {age}a · {listing.odometer.toLocaleString()}km · {conditionLabel[listing.condition]}</p>

          <p className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
          {listing.vat > 0 && <p className="text-xs text-gray-400">+ {formatPrice(listing.vat)} IVA</p>}

          <p className="text-sm text-gray-500 mt-2">📍 {listing.city}, {listing.province}</p>

          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
              {listing.seller_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{listing.seller_name}</p>
              <p className="text-xs text-gray-400">⭐ {listing.seller_rating}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
