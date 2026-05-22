export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  userType: 'seller' | 'buyer' | 'dealer';
  cuit?: string;
  rating?: number;
  createdAt: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  carData: {
    brand: string;
    model: string;
    year: number;
    vin: string;
    odometer: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    color: string;
    city: string;
    province: string;
    description: string;
  };
  price: number;
  vat: number;
  finalPrice: number;
  photoUrls: string[];
  status: 'active' | 'pending' | 'sold';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  views: number;
  createdAt: number;
  updatedAt: number;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  depositAmount: number;
  depositStatus: 'pending' | 'secured' | 'released';
  message: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: number;
  participants: string[];
  messages?: Message[];
}
