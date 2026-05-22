'use client';

import { useState, useEffect } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Message, Conversation } from '@/lib/types';

export const useMessages = (userUID: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userUID) return;

    const conversationsRef = ref(db, 'conversations');
    onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userConversations = Object.entries(data)
          .filter(([_, conv]: any) => conv.participants?.includes(userUID))
          .map(([id, conv]: any) => ({ id, ...conv }));
        setConversations(userConversations);
      } else {
        setConversations([]);
      }
    });
  }, [userUID]);

  useEffect(() => {
    if (!selectedConversation) return;

    const messagesRef = ref(db, `conversations/${selectedConversation}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, msg]: any) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
  }, [selectedConversation]);

  const startConversation = async (
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string,
    listingId: string
  ): Promise<string> => {
    try {
      const convRef = push(ref(db, 'conversations'));
      const conversation: Conversation = {
        id: convRef.key!,
        listingId,
        buyerId,
        buyerName,
        sellerId,
        sellerName,
        lastMessage: '',
        lastMessageAt: Date.now(),
        participants: [buyerId, sellerId],
      };
      await set(convRef, conversation);
      return convRef.key!;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const sendMessage = async (
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string
  ): Promise<Message> => {
    try {
      const msgRef = push(ref(db, `conversations/${conversationId}/messages`));
      const message: Message = {
        id: msgRef.key!,
        conversationId,
        senderId,
        senderName,
        text,
        timestamp: Date.now(),
        read: false,
      };
      await set(msgRef, message);
      
      await set(ref(db, `conversations/${conversationId}/lastMessageAt`), Date.now());
      await set(ref(db, `conversations/${conversationId}/lastMessage`), text);

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
