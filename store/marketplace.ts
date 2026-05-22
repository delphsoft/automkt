import { create } from 'zustand';
import { User, Listing, Offer } from '@/lib/types';

interface MarketplaceStore {
  user: User | null;
  setUser: (user: User | null) => void;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
  filters: {
    minPrice: number;
    maxPrice: number;
    model: string;
    city: string;
    sortBy: 'newest' | 'cheapest' | 'expensive';
  };
  setFilters: (filters: Partial<MarketplaceStore['filters']>) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  listings: [],
  setListings: (listings) => set({ listings }),
  selectedListing: null,
  setSelectedListing: (listing) => set({ selectedListing: listing }),
  offers: [],
  setOffers: (offers) => set({ offers }),
  filters: {
    minPrice: 0,
    maxPrice: 5000000,
    model: '',
    city: '',
    sortBy: 'newest',
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
}));
