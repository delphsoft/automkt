'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useListings } from '@/hooks/useListings'
import { useMessages } from '@/hooks/useMessages'
import { useOffers } from '@/hooks/useOffers'
import { Listing } from '@/lib/types'
import { formatPrice, conditionLabel } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ListingDetail({ params }: { params: { id: string } }) {
  const { user, authUser } = useAuth()
  const { getListing } = useListings()
  const { startConversation } = useMessages(authUser?.id ?? null)
  const { makeOffer } = useOffers(authUser?.id ?? null)

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMsg, setOfferMsg] = useState('')
  const [showOffer, setShowOffer] = useState(false)

  useEffect(() => {
    getListing(params.id).then((data) => { setListing(data); setLoading(false) })
  }, [params.id, getListing])

  const handleContact = async () => {
    if (!authUser || !user || !listing) { toast.error('Iniciá sesión primero'); return }
    try {
      await startConversation(authUser.id, user.name, listing.seller_id, listing.seller_name, listing.id)
      toast.success('¡Conversación iniciada! Revisá tu bandeja.')
    } catch { toast.error('Error al iniciar conversación') }
  }

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser || !user || !listing) return
    try {
      await makeOffer(listing.id, authUser.id, user.name, +offerAmount, offerMsg)
      toast.success('¡Oferta enviada!')
      setShowOffer(false)
    } catch { toast.error('Error al enviar oferta') }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400 animate-pulse">Cargando...</p></div>
  if (!listing) return <div className="min-h-screen flex items-center justify-center"><p>Auto no encontrado. <Link href="/browse" className="text-blue-600">Volver</Link></p></div>

  const isSeller = authUser?.id === listing.seller_id

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/browse" className="text-sm text-gray-400 hover:text-blue-600 mb-4 block">← Volver al listado</Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-80">
              {listing.photo_urls?.[photoIdx] ? (
                <img src={listing.photo_urls[photoIdx]} alt={listing.model} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center text-6xl">🚗</div>}
            </div>
            {listing.photo_urls?.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {listing.photo_urls.map((url, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 ${i === photoIdx ? 'border-blue-600' : 'border-transparent'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-1">{listing.brand} {listing.model}</h1>
            <p className="text-gray-500 mb-4">{listing.year} · {listing.odometer.toLocaleString()}km · {conditionLabel[listing.condition]} · {listing.color}</p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-4xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
              {listing.vat > 0 && <p className="text-sm text-gray-500 mt-1">+ {formatPrice(listing.vat)} IVA → Total: {formatPrice(listing.final_price)}</p>}
              {listing.vat === 0 && <p className="text-sm text-green-600 mt-1">✓ Exento de IVA (primera venta)</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {[
                ['📍 Ubicación', `${listing.city}, ${listing.province}`],
                ['🔑 VIN', listing.vin],
                ['✅ Estado', listing.verification_status === 'verified' ? 'Verificado RENAPER' : 'Pendiente'],
                ['📅 Publicado', new Date(listing.created_at).toLocaleDateString('es-AR')],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">{k}</p>
                  <p className="font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            {listing.description && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">Descripción</p>
                <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {listing.seller_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{listing.seller_name}</p>
                <p className="text-xs text-gray-400">⭐ {listing.seller_rating} · Vendedor verificado</p>
              </div>
            </div>

            {!isSeller && (
              <div className="space-y-3">
                <button onClick={handleContact} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Contactar vendedor
                </button>
                <button onClick={() => setShowOffer(!showOffer)} className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                  Hacer una oferta
                </button>
                {showOffer && (
                  <form onSubmit={handleOffer} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="text-sm font-semibold block mb-1">Monto de la oferta (ARS)</label>
                      <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} required placeholder={String(listing.price)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1">Mensaje</label>
                      <textarea value={offerMsg} onChange={(e) => setOfferMsg(e.target.value)} rows={2} placeholder="¿Querés coordinar una inspección?" className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 text-sm">
                      Enviar oferta
                    </button>
                  </form>
                )}
              </div>
            )}

            {isSeller && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-center text-sm font-semibold">
                ✓ Este es tu anuncio
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
