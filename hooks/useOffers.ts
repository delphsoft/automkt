'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Offer } from '@/lib/types'

export const useOffers = (userId: string | null) => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    supabase.from('offers').select('*').or(`buyer_id.eq.${userId}`).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOffers(data) })
  }, [userId])

  const makeOffer = async (listingId: string, buyerId: string, buyerName: string, amount: number, message: string): Promise<Offer> => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('offers').insert({
        listing_id: listingId, buyer_id: buyerId, buyer_name: buyerName,
        amount, status: 'pending', deposit_amount: Math.round(amount * 0.1), message,
      }).select().single()
      if (error) throw error
      return data
    } finally { setLoading(false) }
  }

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'rejected') => {
    await supabase.from('offers').update({ status }).eq('id', offerId)
    setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status } : o))
  }

  return { offers, loading, makeOffer, updateOfferStatus }
}
