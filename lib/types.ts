export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  user_type: 'seller' | 'buyer' | 'dealer'
  cuit?: string
  rating: number
  created_at: string
}

export interface Listing {
  id: string
  seller_id: string
  seller_name: string
  seller_rating: number
  brand: string
  model: string
  year: number
  vin: string
  odometer: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  color: string
  city: string
  province: string
  description: string
  price: number
  vat: number
  final_price: number
  photo_urls: string[]
  status: 'active' | 'pending' | 'sold'
  verification_status: 'pending' | 'verified' | 'rejected'
  is_first_sale: boolean
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  buyer_name: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  deposit_amount: number
  message: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  text: string
  created_at: string
  read: boolean
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  buyer_name: string
  seller_id: string
  seller_name: string
  last_message: string
  last_message_at: string
  created_at: string
}
