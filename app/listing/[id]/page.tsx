'use client';

import { useEffect, useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { Listing } from '@/lib/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ListingDetail({ params }: { params: { id: string } }) {
  const { getListing } = useListings();
  const { user, firebaseUser } = useAuth();
  const { startConversation } = useMessages(firebaseUser?.uid || null);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getListing(params.id);
      setListing(data);
      setLoading(false);
    })();
  }, [params.id, getListing]);

  const handleContact = async () => {
    if (!firebaseUser || !user) {
      toast.error('Por favor inicia sesión primero');
      return;
    }

    try {
      await startConversation(
        firebaseUser.uid,
        user.name,
        listing!.sellerId,
        listing!.sellerName,
        listing!.id
      );
      toast.success('¡Conversación iniciada!');
    } catch (error) {
      toast.error('Error al iniciar conversación');
    }
  };

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!listing) return <div className="text-center py-12">Auto no encontrado</div>;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VendeBYD
          </Link>
          <div className="flex gap-4">
            <Link href="/browse" className="text-gray-600 hover:text-blue-600">
              Buscar
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600">
              Vender
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photos */}
          <div>
            <img
              src={listing.photoUrls[currentPhotoIndex]}
              alt="Auto"
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div className="flex gap-2 overflow-x-auto">
              {listing.photoUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhotoIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded ${
                    i === currentPhotoIndex ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {listing.carData.brand} {listing.carData.model}
            </h1>
            <p className="text-gray-600 mb-4">
              {listing.carData.year} • {listing.carData.odometer}km • {listing.carData.condition}
            </p>

            {/* Price */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Precio</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">{formatPrice(listing.price)}</p>
              {listing.vat > 0 && (
                <p className="text-sm text-gray-600">+ {formatPrice(listing.vat)} (impuesto)</p>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Ubicación</p>
                  <p className="font-semibold">{listing.carData.city}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Color</p>
                  <p className="font-semibold">{listing.carData.color}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">VIN</p>
                  <p className="font-semibold text-xs">{listing.carData.vin}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Estado</p>
                  <p className="font-semibold capitalize">{listing.carData.condition}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Descripción</p>
              <p className="text-gray-700">{listing.carData.description}</p>
            </div>

            {/* Seller */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-bold text-lg">
                  {listing.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{listing.sellerName}</p>
                  <p className="text-gray-600">⭐ {listing.sellerRating} (vendedor)</p>
                </div>
              </div>

              {/* Actions */}
              {firebaseUser?.uid !== listing.sellerId && (
                <div className="space-y-3">
                  <button
                    onClick={handleContact}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                  >
                    Contactar vendedor
                  </button>
                  <button className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50">
                    Hacer oferta
                  </button>
                </div>
              )}

              {firebaseUser?.uid === listing.sellerId && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700 text-center">
                  ✓ Este es tu auto
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
