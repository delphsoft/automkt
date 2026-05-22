// ============================================================================
// BYD MARKETPLACE MVP - React/Firebase Boilerplate
// ============================================================================
// This is a production-ready starter for your China EV marketplace
// Follow the setup instructions below to get running in 2 weeks
//
// Stack: React 18, Firebase (Realtime DB + Auth), Tailwind CSS
// ============================================================================

// SETUP INSTRUCTIONS:
// 1. npx create-react-app byd-marketplace
// 2. npm install firebase axios zustand
// 3. npm install -D tailwindcss postcss autoprefixer
// 4. npx tailwindcss init -p
// 5. Replace src files with code below
// 6. Get Firebase credentials from console.firebase.google.com
// 7. npm start

// ============================================================================
// 1. config/firebase.js
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// ============================================================================
// 2. store/marketplace.js (Zustand state management)
// ============================================================================

import { create } from 'zustand';

export const useMarketplaceStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),
  userType: null, // 'seller', 'buyer', 'dealer'
  setUserType: (type) => set({ userType: type }),

  // Listings
  listings: [],
  setListings: (listings) => set({ listings }),
  selectedListing: null,
  setSelectedListing: (listing) => set({ selectedListing: listing }),

  // Filters
  filters: {
    minPrice: 0,
    maxPrice: 5000000,
    model: '',
    city: '',
    sortBy: 'newest',
  },
  setFilters: (filters) => set({ filters }),

  // Messages
  messages: [],
  setMessages: (messages) => set({ messages }),
  conversations: [],
  setConversations: (convs) => set({ conversations: convs }),

  // Offers & Transactions
  activeOffers: [],
  setActiveOffers: (offers) => set({ activeOffers: offers }),
  completedSales: [],
  setCompletedSales: (sales) => set({ completedSales: sales }),
}));

// ============================================================================
// 3. hooks/useFirebaseAuth.js
// ============================================================================

import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Realtime DB
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        setUser({ ...firebaseUser, profile: snapshot.val() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, profile) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${newUser.uid}`), profile);
    return newUser;
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return { user, loading, signup, login, logout };
};

// ============================================================================
// 4. hooks/useListings.js
// ============================================================================

import { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase';
import { ref, push, set, get, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Real-time listener for all listings
    const listingsRef = ref(db, 'listings');
    onValue(listingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setListings(Object.entries(data).map(([id, listing]) => ({ id, ...listing })));
      } else {
        setListings([]);
      }
    });
  }, []);

  const createListing = async (sellerUID, carData, photos) => {
    try {
      setLoading(true);

      // Upload photos to Firebase Storage
      const photoUrls = [];
      for (let photo of photos) {
        const storageReference = storageRef(storage, `listings/${sellerUID}/${Date.now()}_${photo.name}`);
        await uploadBytes(storageReference, photo);
        const url = await getDownloadURL(storageReference);
        photoUrls.push(url);
      }

      // Auto-calculate VAT (simplified; in production, call AFIP API)
      const vat = carData.isFirstSale ? 0 : Math.round(carData.price * 0.21);
      const finalPrice = carData.price + vat;

      // Create listing in Realtime DB
      const listingRef = push(ref(db, 'listings'));
      const listing = {
        id: listingRef.key,
        sellerId: sellerUID,
        carData,
        photoUrls,
        price: carData.price,
        finalPrice,
        vat,
        status: 'active', // active, pending, sold
        createdAt: Date.now(),
        updatedAt: Date.now(),
        views: 0,
        favorites: 0,
        offers: {},
        verificationStatus: 'pending', // pending, verified, rejected
      };

      await set(listingRef, listing);
      return listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateListing = async (listingId, updates) => {
    try {
      const listingRef = ref(db, `listings/${listingId}`);
      await set(listingRef, {
        ...listings.find((l) => l.id === listingId),
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const getListing = async (listingId) => {
    try {
      const listingRef = ref(db, `listings/${listingId}`);
      const snapshot = await get(listingRef);
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  };

  return {
    listings,
    loading,
    createListing,
    updateListing,
    getListing,
  };
};

// ============================================================================
// 5. hooks/useMessaging.js
// ============================================================================

import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, push, set, onValue, get, query, orderByChild, equalTo } from 'firebase/database';

export const useMessaging = (userUID) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Listen to conversations for current user
  useEffect(() => {
    if (!userUID) return;

    const conversationsRef = ref(db, 'conversations');
    onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userConversations = Object.entries(data)
          .filter(([_, conv]) => conv.participants.includes(userUID))
          .map(([id, conv]) => ({ id, ...conv }));
        setConversations(userConversations);
      }
    });
  }, [userUID]);

  // Listen to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const messagesRef = ref(db, `conversations/${selectedConversation}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, msg]) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
  }, [selectedConversation]);

  const startConversation = async (buyerId, sellerId, listingId) => {
    try {
      const conversationRef = push(ref(db, 'conversations'));
      const conversation = {
        id: conversationRef.key,
        buyerId,
        sellerId,
        listingId,
        participants: [buyerId, sellerId],
        createdAt: Date.now(),
        lastMessageAt: Date.now(),
        messages: {},
      };
      await set(conversationRef, conversation);
      return conversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const sendMessage = async (conversationId, senderUID, text) => {
    try {
      const messageRef = push(ref(db, `conversations/${conversationId}/messages`));
      const message = {
        id: messageRef.key,
        senderId: senderUID,
        text,
        timestamp: Date.now(),
        read: false,
      };
      await set(messageRef, message);

      // Update conversation lastMessageAt
      await set(ref(db, `conversations/${conversationId}/lastMessageAt`), Date.now());

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    startConversation,
    sendMessage,
  };
};

// ============================================================================
// 6. components/ListingCard.jsx
// ============================================================================

import React, { useState } from 'react';

const ListingCard = ({ listing, onSelect }) => {
  const [favorite, setFavorite] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getYearsOld = (year) => {
    return new Date().getFullYear() - year;
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={listing.photoUrls?.[0] || 'https://via.placeholder.com/400x300'}
          alt={listing.carData.model}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFavorite(!favorite);
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-lg"
        >
          <span className={favorite ? '❤️' : '🤍'} />
        </button>
        {listing.verificationStatus === 'verified' && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            ✓ Verificado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">
              {listing.carData.brand} {listing.carData.model}
            </h3>
            <p className="text-sm text-gray-500">
              {listing.carData.year} • {getYearsOld(listing.carData.year)} años • {listing.carData.odometer}km
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
          <p className="text-xs text-gray-500">
            {listing.vat > 0 && `+ ${formatPrice(listing.vat)} (impuesto)`}
          </p>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-3">📍 {listing.carData.city}, {listing.carData.province}</p>

        {/* Seller Info */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-semibold text-sm">
            {listing.sellerName?.charAt(0) || 'S'}
          </div>
          <div className="text-sm">
            <p className="font-semibold">{listing.sellerName || 'Vendedor'}</p>
            <p className="text-gray-500 text-xs">⭐ {listing.sellerRating || 'Sin rating'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;

// ============================================================================
// 7. components/ListingForm.jsx (Seller listing creation)
// ============================================================================

import React, { useState } from 'react';
import { useListings } from '../hooks/useListings';
import { useMarketplaceStore } from '../store/marketplace';

const ListingForm = ({ onSuccess }) => {
  const user = useMarketplaceStore((s) => s.user);
  const { createListing, loading } = useListings();
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    brand: 'BYD',
    model: '',
    year: new Date().getFullYear(),
    price: 2000000,
    odometer: 0,
    condition: 'excellent',
    city: 'Córdoba',
    province: 'Córdoba',
    description: '',
    vin: '',
    isFirstSale: true,
  });

  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert('Por favor sube al menos 3 fotos');
      return;
    }

    try {
      await createListing(user.uid, formData, photos);
      alert('¡Anuncio creado exitosamente!');
      onSuccess?.();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Registra tu BYD</h1>

      {/* Car Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Marca</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Modelo</label>
          <select
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option>-- Selecciona --</option>
            <option>Seagull</option>
            <option>Yuan Plus</option>
            <option>Song</option>
            <option>Atto 3</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2">Año</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="2015"
            max={new Date().getFullYear()}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Kilometraje</label>
          <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* VIN */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">VIN</label>
        <input
          type="text"
          name="vin"
          value={formData.vin}
          onChange={handleInputChange}
          placeholder="Número de identificación del vehículo"
          required
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Se verificará automáticamente en RENAPER</p>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Precio (ARS)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Condición</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="excellent">Excelente</option>
            <option value="good">Muy bueno</option>
            <option value="fair">Bueno</option>
            <option value="poor">Regular</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Ciudad</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Provincia</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe el estado del auto, características, mantenimiento, etc."
          rows="4"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Photos */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Fotos (mínimo 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          required
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">{photos.length} archivos seleccionados</p>
      </div>

      {/* VAT Checkbox */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFirstSale"
            checked={formData.isFirstSale}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <span>Esta es mi primera venta (sin IVA)</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">El IVA se calculará automáticamente según AFIP</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Cargando...' : 'Publicar anuncio (es gratis)'}
      </button>
    </form>
  );
};

export default ListingForm;

// ============================================================================
// 8. pages/BuyerBrowse.jsx
// ============================================================================

import React, { useState, useMemo } from 'react';
import { useMarketplaceStore } from '../store/marketplace';
import ListingCard from '../components/ListingCard';
import { useListings } from '../hooks/useListings';

const BuyerBrowse = () => {
  const { listings } = useListings();
  const filters = useMarketplaceStore((s) => s.filters);
  const setFilters = useMarketplaceStore((s) => s.setFilters);
  const setSelectedListing = useMarketplaceStore((s) => s.setSelectedListing);

  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.status === 'active')
      .filter((l) => l.price >= filters.minPrice && l.price <= filters.maxPrice)
      .filter((l) => !filters.model || l.carData.model.includes(filters.model))
      .filter((l) => !filters.city || l.carData.city.includes(filters.city))
      .sort((a, b) => {
        if (filters.sortBy === 'newest') return b.createdAt - a.createdAt;
        if (filters.sortBy === 'cheapest') return a.price - b.price;
        if (filters.sortBy === 'expensive') return b.price - a.price;
        return 0;
      });
  }, [listings, filters]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Busca tu BYD ideal</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold mb-2">Precio mínimo</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Precio máximo</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Modelo</label>
            <select
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="Seagull">Seagull</option>
              <option value="Yuan Plus">Yuan Plus</option>
              <option value="Song">Song</option>
              <option value="Atto 3">Atto 3</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="newest">Más reciente</option>
              <option value="cheapest">Más barato</option>
              <option value="expensive">Más caro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay autos disponibles con estos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={() => {
                setSelectedListing(listing);
                window.location.href = `/listing/${listing.id}`;
              }}
            />
          ))}
        </div>
      )}

      <p className="text-center mt-8 text-gray-500">
        {filteredListings.length} auto{filteredListings.length !== 1 ? 's' : ''} disponible{filteredListings.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default BuyerBrowse;

// ============================================================================
// 9. App.jsx (Main routing)
// ============================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useMarketplaceStore } from './store/marketplace';

import ListingForm from './components/ListingForm';
import BuyerBrowse from './pages/BuyerBrowse';

const App = () => {
  const { user, loading } = useFirebaseAuth();
  const setUser = useMarketplaceStore((s) => s.setUser);

  React.useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuyerBrowse />} />
        <Route path="/sell" element={user ? <ListingForm /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

// ============================================================================
// 10. .env.local (Firebase credentials - DO NOT COMMIT)
// ============================================================================

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

// ============================================================================
// DEPLOYMENT (Firebase Hosting)
// ============================================================================

// 1. npm run build
// 2. npm install -g firebase-tools
// 3. firebase login
// 4. firebase init hosting
// 5. firebase deploy

// ============================================================================
// NEXT STEPS
// ============================================================================

/*
Week 1-2: 
  - [ ] Get Firebase credentials
  - [ ] Setup React project
  - [ ] Implement auth (email/password signup/login)
  - [ ] Create listing form

Week 2-3:
  - [ ] Implement listing browsing + filtering
  - [ ] Implement RENAPER VIN verification (mock for now)
  - [ ] Setup messaging system

Week 3-4:
  - [ ] Add inspection booking integration
  - [ ] Implement offer system + escrow mock
  - [ ] Create seller dashboard

Week 4+:
  - [ ] Integrate Stripe for payments
  - [ ] Integrate Ualá/Mercado Crédito for financing
  - [ ] Add insurance APIs
  - [ ] Implement referral tracking
  - [ ] Deploy to Firebase Hosting
*/
