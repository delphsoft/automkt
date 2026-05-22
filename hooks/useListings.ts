'use client';

import { useState, useEffect } from 'react';
import { ref, push, set, get, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Listing } from '@/lib/types';
import { verifyVIN, calculateVAT } from '@/lib/renaper';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listingsRef = ref(db, 'listings');
    onValue(listingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listingsArray = Object.entries(data).map(([id, listing]: any) => ({
          id,
          ...listing,
        }));
        setListings(listingsArray);
      } else {
        setListings([]);
      }
    });
  }, []);

  const createListing = async (
    sellerUID: string,
    sellerName: string,
    carData: any,
    photos: File[],
    isFirstSale: boolean
  ): Promise<Listing> => {
    try {
      setLoading(true);

      const vinVerification = await verifyVIN(carData.vin);
      if (!vinVerification.valid) {
        throw new Error('VIN inválido o no encontrado en RENAPER');
      }

      const photoUrls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const photoRef = storageRef(
          storage,
          `listings/${sellerUID}/${Date.now()}_${i}_${photo.name}`
        );
        await uploadBytes(photoRef, photo);
        const url = await getDownloadURL(photoRef);
        photoUrls.push(url);
      }

      const vat = calculateVAT(carData.price, isFirstSale);
      const finalPrice = carData.price + vat;

      const listingRef = push(ref(db, 'listings'));
      const listing: Listing = {
        id: listingRef.key!,
        sellerId: sellerUID,
        sellerName,
        sellerRating: 5,
        carData,
        price: carData.price,
        vat,
        finalPrice,
        photoUrls,
        status: 'active',
        verificationStatus: 'verified',
        views: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
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

  const getListing = async (id: string): Promise<Listing | null> => {
    try {
      const snapshot = await get(ref(db, `listings/${id}`));
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      await set(ref(db, `listings/${id}`), {
        ...listings.find((l) => l.id === id),
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  return {
    listings,
    loading,
    createListing,
    getListing,
    updateListing,
  };
};
