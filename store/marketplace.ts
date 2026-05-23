import { create } from 'zustand'
import { UserProfile, Listing } from '@/lib/types'

interface Filters {
  minPrice: number
  maxPrice: number
  model: string
  city: string
  sortBy: 'newest' | 'cheapest' | 'expensive'
}

interface MarketplaceStore {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  listings: Listing[]
  setListings: (listings: Listing[]) => void
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  listings: [],
  setListings: (listings) => set({ listings }),
  filters: {
    minPrice: 0,
    maxPrice: 5000000,
    model: '',
    city: '',
    sortBy: 'newest',
  },
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
}))
