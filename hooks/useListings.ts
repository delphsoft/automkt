'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Listing } from '@/lib/types'
import { calculateVAT } from '@/lib/utils'

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchListings()

    const channel = supabase
      .channel('listings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
        fetchListings()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (data) setListings(data)
  }

  const createListing = async (
    sellerId: string,
    sellerName: string,
    formData: {
      model: string; year: number; vin: string; odometer: number
      condition: string; color: string; city: string; province: string
      description: string; price: number; is_first_sale: boolean
    },
    photos: File[]
  ): Promise<Listing> => {
    setLoading(true)
    try {
      const photoUrls: string[] = []
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i]
        const path = `${sellerId}/${Date.now()}_${i}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(path, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(path)
        photoUrls.push(publicUrl)
      }

      const vat = calculateVAT(formData.price, formData.is_first_sale)

      const { data, error } = await supabase
        .from('listings')
        .insert({
          seller_id: sellerId,
          seller_name: sellerName,
          seller_rating: 5,
          brand: 'BYD',
          model: formData.model,
          year: formData.year,
          vin: formData.vin,
          odometer: formData.odometer,
          condition: formData.condition,
          color: formData.color,
          city: formData.city,
          province: formData.province,
          description: formData.description,
          price: formData.price,
          vat,
          final_price: formData.price + vat,
          photo_urls: photoUrls,
          status: 'active',
          verification_status: 'verified',
          is_first_sale: formData.is_first_sale,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  const getListing = async (id: string): Promise<Listing | null> => {
    const { data } = await supabase.from('listings').select('*').eq('id', id).single()
    return data
  }

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    await supabase.from('listings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  }

  return { listings, loading, createListing, getListing, updateListing, refetch: fetchListings }
}
