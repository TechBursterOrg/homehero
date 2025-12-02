import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  MessageSquare,
  Plus,
  User
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MessagesProps {
  onSendMessage?: (conversationId: string, content: string) => void;
  onStartConversation?: (providerId: string) => void;
  onSetActiveConversation?: (conversationId: string) => void;
  currentUser?: any;
}

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
  isMe?: boolean;
  isProvider?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Messages: React.FC<MessagesProps> = ({ 
  onSendMessage,
  onStartConversation,
  onSetActiveConversation,
  currentUser = null 
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatArea, setShowChatArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Get current user ID from token or props
  const getCurrentUserId = () => {
    if (currentUser?._id) return currentUser._id;
    if (currentUser?.id) return currentUser.id;
    
    // Try to get from localStorage token
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      }
    } catch (error) {
      console.error('Error getting user ID from token:', error);
    }
    
    return null;
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      if (onSetActiveConversation) {
        onSetActiveConversation(selectedConversation._id);
      }
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle location state for pre-selected conversations
  useEffect(() => {
    if (location.state?.activeConversationId) {
      console.log('📍 Location state has active conversation:', location.state.activeConversationId);
      // Find and select the conversation
      const conversation = conversations.find(conv => conv._id === location.state.activeConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        setShowChatArea(true);
      } else {
        // If conversation not found in list, try to fetch it
        fetchConversationById(location.state.activeConversationId);
      }
    }
  }, [location.state, conversations]);

  const fetchConversationById = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.conversation) {
          setSelectedConversation(data.data.conversation);
          setShowChatArea(true);
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        if (data.success) {
          setConversations(data.data.conversations || []);
          console.log('📨 Loaded conversations:', data.data.conversations?.length || 0);
        }
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const currentUserId = getCurrentUserId();
        
        console.log('=== DEBUG MESSAGE FETCH ===');
        console.log('Current User ID:', currentUserId);
        console.log('Raw messages:', data.data?.messages);
        
        if (data.data?.messages) {
          const messagesWithAlignment = data.data.messages.map((msg: Message) => {
            let msgSenderId = '';
            if (typeof msg.senderId === 'string') {
              msgSenderId = msg.senderId;
            } else if (msg.senderId && typeof msg.senderId === 'object') {
              msgSenderId = msg.senderId._id || msg.senderId.id || '';
            }
            
            const isMe = msgSenderId === currentUserId;
            const isProvider = isMe;
            
            return {
              ...msg,
              isMe,
              isProvider
            };
          });
          
          setMessages(messagesWithAlignment);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      
      if (onSendMessage) {
        await onSendMessage(selectedConversation._id, newMessage.trim());
      } else {
        // Default implementation
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            conversationId: selectedConversation._id,
            content: newMessage.trim(),
            messageType: 'text'
          })
        });

        if (response.ok) {
          fetchMessages(selectedConversation._id);
          fetchConversations();
        }
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowChatArea(true);
  };

  const handleBackToList = () => {
    setShowChatArea(false);
    setSelectedConversation(null);
    setMessages([]);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return conversation.participants[0];
    
    return conversation.participants.find(p => {
      const participantId = p._id || p.id;
      return participantId !== currentUserId;
    });
  };

  const getParticipantType = (participant: any) => {
    return 'customer';
  };

  const getLastMessageTime = (timestamp: string) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      const minutes = Math.floor(hours * 60);
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    const matchesSearch = otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageStatus = (message: Message) => {
    if (message.isMe) {
      switch (message.status) {
        case 'sent':
          return <Clock className="w-3 h-3 text-blue-300" />;
        case 'delivered':
          return <Check className="w-3 h-3 text-blue-300" />;
        case 'read':
          return <CheckCheck className="w-3 h-3 text-blue-200" />;
        default:
          return null;
      }
    }
    return null;
  };

  const getMessageAlignment = (message: Message) => {
    return message.isMe ? 'right' : 'left';
  };

  const getMessageStyle = (message: Message) => {
    const alignment = getMessageAlignment(message);
    
    if (alignment === 'right') {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
    } else {
      return 'bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-16px)] sm:h-[calc(100vh-80px)] lg:h-[calc(100vh-200px)] flex">
          {/* Conversations List */}
          <div className={`w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            showChatArea ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-white/50">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500 px-4">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium text-sm sm:text-base">No conversations yet</p>
                  <p className="text-xs sm:text-sm">Start a conversation by messaging a provider</p>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2 p-2">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const participantType = getParticipantType(otherParticipant);
                    
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-300 group ${
                          selectedConversation?._id === conversation._id 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="relative flex-shrink-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg ${
                              'bg-gradient-to-br from-blue-500 to-purple-600'
                            }`}>
                              {otherParticipant?.name?.charAt(0) || 'U'}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                              'bg-blue-500'
                            }`}></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm sm:text-base">
                                  {otherParticipant?.name || 'Unknown User'}
                                </h4>
                                <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  Customer
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {conversation.lastMessage && getLastMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${
            showChatArea ? 'flex' : 'hidden lg:flex'
          }`}>
            {selectedConversation ? (
              <>
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                      <button
                        onClick={handleBackToList}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg ${
                          'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}>
                          {getOtherParticipant(selectedConversation)?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                            {getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                          </h3>
                          <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                            'bg-blue-100 text-blue-800'
                          }`}>
                            Customer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full ${
                            'bg-blue-500'
                          }`}></span>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="w-9 h-9 sm:w-12 sm:h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-white/30 to-blue-50/30">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                      <p className="font-medium text-sm sm:text-base">No messages yet</p>
                      <p className="text-xs sm:text-sm">Start a conversation by sending a message</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const alignment = getMessageAlignment(message);
                      const messageStyle = getMessageStyle(message);
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm relative ${messageStyle}`}>
                            {alignment === 'left' && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-500">
                                  Customer
                                </span>
                              </div>
                            )}
                            
                            <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
                            <div className={`flex items-center justify-end mt-1 sm:mt-2 text-xs gap-1 ${
                              alignment === 'right' ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              <span>{formatTime(message.timestamp)}</span>
                              {renderMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0">
                      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                        disabled={sending}
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                        newMessage.trim() && !sending
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-110'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-sm sm:text-base text-gray-600">Choose a provider to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;