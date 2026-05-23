'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Conversation, Message } from '@/lib/types'

export const useMessages = (userId: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    fetchConversations()

    const channel = supabase
      .channel(`messages-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message
        if (msg.conversation_id === selectedConvId) {
          setMessages((prev) => [...prev, msg])
        }
        fetchConversations()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, selectedConvId])

  useEffect(() => {
    if (!selectedConvId) return
    fetchMessages(selectedConvId)
  }, [selectedConvId])

  const fetchConversations = async () => {
    if (!userId) return
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })
    if (data) setConversations(data)
  }

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  const startConversation = async (
    buyerId: string, buyerName: string,
    sellerId: string, sellerName: string,
    listingId: string
  ): Promise<string> => {
    const existing = conversations.find(
      (c) => c.listing_id === listingId && c.buyer_id === buyerId
    )
    if (existing) return existing.id

    const { data, error } = await supabase
      .from('conversations')
      .insert({ listing_id: listingId, buyer_id: buyerId, buyer_name: buyerName, seller_id: sellerId, seller_name: sellerName, last_message: '', last_message_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data.id
  }

  const sendMessage = async (convId: string, senderId: string, senderName: string, text: string) => {
    const { error } = await supabase.from('messages').insert({
      conversation_id: convId, sender_id: senderId, sender_name: senderName, text, read: false,
    })
    if (error) throw error
    await supabase.from('conversations').update({ last_message: text, last_message_at: new Date().toISOString() }).eq('id', convId)
  }

  return { conversations, messages, selectedConvId, setSelectedConvId, startConversation, sendMessage }
}
