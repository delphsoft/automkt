'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/types'
import { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setUser(data)
    setLoading(false)
  }

  const signup = async (email: string, password: string, profile: Omit<UserProfile, 'id' | 'created_at' | 'rating'>) => {
    setError(null)
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); throw authError }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name: profile.name,
        phone: profile.phone,
        user_type: profile.user_type,
        cuit: profile.cuit ?? null,
        rating: 5,
      })
    }
    return data.user
  }

  const login = async (email: string, password: string) => {
    setError(null)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); throw authError }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, authUser, loading, error, signup, login, logout, isAuthenticated: !!authUser }
}
