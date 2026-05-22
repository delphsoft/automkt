'use client';

import { Listing } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const [favorite, setFavorite] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  const yearsOld = new Date().getFullYear() - listing.carData.year;

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={listing.photoUrls[0] || '/placeholder.png'}
            alt={listing.carData.model}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setFavorite(!favorite);
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-lg"
          >
            {favorite ? '❤️' : '🤍'}
          </button>
          {listing.verificationStatus === 'verified' && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              ✓ Verificado
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg">
            {listing.carData.brand} {listing.carData.model}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {listing.carData.year} • {yearsOld}a • {listing.carData.odometer}km
          </p>

          <p className="text-2xl font-bold text-blue-600 mb-1">
            {formatPrice(listing.price)}
          </p>
          {listing.vat > 0 && (
            <p className="text-xs text-gray-500 mb-3">
              + {formatPrice(listing.vat)} (impuesto)
            </p>
          )}

          <p className="text-sm text-gray-600 mb-3">
            📍 {listing.carData.city}
          </p>

          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
              {listing.sellerName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{listing.sellerName}</p>
              <p className="text-xs text-gray-500">⭐ {listing.sellerRating}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
