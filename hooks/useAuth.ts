'use client';

import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '@/lib/firebase';
import { User } from '@/lib/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = ref(db, `users/${fbUser.uid}`);
          const snapshot = await get(userRef);
          setUser(snapshot.val());
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
      }
      setFirebaseUser(fbUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (
    email: string,
    password: string,
    profile: Omit<User, 'uid'>
  ) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const userProfile: User = {
        ...profile,
        uid: result.user.uid,
      };
      
      await set(ref(db, `users/${result.user.uid}`), userProfile);
      return result.user;
    } catch (err: any) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'El email ya está registrado'
        : err.message;
      setError(message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = err.code === 'auth/user-not-found'
        ? 'Usuario no encontrado'
        : err.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : err.message;
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
