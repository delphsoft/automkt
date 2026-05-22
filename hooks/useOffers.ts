'use client';

import { useState, useEffect } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Offer } from '@/lib/types';

export const useOffers = (userUID: string | null) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userUID) return;

    const offersRef = ref(db, 'offers');
    onValue(offersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userOffers = Object.entries(data)
          .filter(([_, offer]: any) => offer.buyerId === userUID)
          .map(([id, offer]: any) => ({ id, ...offer }));
        setOffers(userOffers);
      } else {
        setOffers([]);
      }
    });
  }, [userUID]);

  const makeOffer = async (
    listingId: string,
    buyerId: string,
    buyerName: string,
    amount: number,
    message: string
  ): Promise<Offer> => {
    try {
      setLoading(true);
      const offerRef = push(ref(db, 'offers'));
      const depositAmount = Math.round(amount * 0.1);
      
      const offer: Offer = {
        id: offerRef.key!,
        listingId,
        buyerId,
        buyerName,
        amount,
        status: 'pending',
        depositAmount,
        depositStatus: 'pending',
        message,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(offerRef, offer);
      return offer;
    } catch (error) {
      console.error('Error making offer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offerId: string) => {
    try {
      setLoading(true);
      await set(ref(db, `offers/${offerId}/status`), 'accepted');
      await set(ref(db, `offers/${offerId}/depositStatus`), 'secured');
      await set(ref(db, `offers/${offerId}/updatedAt`), Date.now());
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectOffer = async (offerId: string) => {
    try {
      setLoading(true);
      await set(ref(db, `offers/${offerId}/status`), 'rejected');
      await set(ref(db, `offers/${offerId}/updatedAt`), Date.now());
    } catch (error) {
      console.error('Error rejecting offer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    offers,
    loading,
    makeOffer,
    acceptOffer,
    rejectOffer,
  };
};
