// hooks/useChat.ts
import { useState, useEffect } from 'react';

interface Conversation {
  _id: string;
  participants: any[];
  lastMessage?: any;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  senderId: any;
  content: string;
  messageType: string;
  status: string;
  timestamp: string;
}

export const useChat = (currentUser: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => ({
          ...prev,
          [conversationId]: data.data.messages
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId,
          content,
          messageType: 'text'
        })
      });

      if (response.ok) {
        fetchMessages(conversationId);
        fetchConversations(); // Refresh conversations to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startConversation = async (participantId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          participantId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveConversation(data.data.conversation._id);
        fetchConversations();
        return data.data.conversation;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return {
    conversations,
    activeConversation,
    messages: messages[activeConversation || ''] || [],
    loading,
    setActiveConversation,
    sendMessage,
    startConversation,
    fetchMessages
  };
};