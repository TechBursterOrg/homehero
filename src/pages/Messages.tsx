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
  Star,
  MapPin,
  ArrowLeft,
  MessageSquare,
  Users,
  Zap,
  Activity,
  Sparkles,
  ChevronRight,
  Plus,
  Settings,
  Archive
} from 'lucide-react';

interface MessagesProps {
  notifications?: number;
  setNotifications?: (count: number) => void;
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
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


const Messages: React.FC<MessagesProps> = ({ 
  notifications = 0, 
  setNotifications = () => {},
  currentUser = null
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatArea, setShowChatArea] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'online'>('all');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    fetchConversations();
  }, []);

  
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      
      const interval = setInterval(() => {
        fetchMessages(selectedConversation._id, true);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

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

  const fetchMessages = async (conversationId: string, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${conversationId}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const messagesWithMe = data.data.messages.map((msg: Message) => ({
          ...msg,
          isMe: msg.senderId._id === currentUser?.id
        }));
        setMessages(messagesWithMe);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
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
        setNewMessage('');
        
        fetchMessages(selectedConversation._id, true);
       
        fetchConversations();
      }
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
    return conversation.participants.find(p => p._id !== currentUser?.id);
  };

  const getLastMessageTime = (timestamp: string) => {
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

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    const matchesSearch = otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  
  const initiateCall = async (isVideo = false) => {
    if (!selectedConversation) return;
    
    const otherParticipant = getOtherParticipant(selectedConversation);
    if (!otherParticipant) return;

    try {
      
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      
      
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      
      const token = localStorage.getItem('token');
      await fetch('/api/calls/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: otherParticipant._id,
          offer: offer
        })
      });
      
      alert(`Call initiated with ${otherParticipant.name}`);
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-4 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Messages 💬
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-lg hidden sm:block">Stay connected with your clients</p>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-green-200 flex items-center gap-2 lg:gap-3 text-sm lg:text-base">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span className="hidden sm:inline">New Conversation</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Main Messages Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)] lg:h-[calc(100vh-400px)] min-h-[500px] lg:min-h-[600px] flex">
          {/* Conversations List */}
          <div className={`conversation-list w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            showChatArea ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Search and Filters */}
            <div className="p-3 lg:p-6 border-b border-gray-200 bg-white/50">
              <div className="space-y-3 lg:space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2.5 lg:py-3 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-base"
                    style={{ fontSize: '16px' }}
                  />
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      filterType === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({conversations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      filterType === 'unread' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread (0)
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">Loading conversations...</div>
              ) : filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`group p-3 lg:p-6 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${
                      selectedConversation?._id === conversation._id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-lg shadow-lg">
                          {otherParticipant?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 lg:mb-2">
                          <div className="flex items-center gap-1 lg:gap-2 min-w-0">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm lg:text-base truncate">
                              {otherParticipant?.name || 'Unknown User'}
                            </h4>
                          </div>
                          <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                            {conversation.lastMessage && getLastMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-xs lg:text-sm text-gray-600 truncate font-medium">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredConversations.length === 0 && !loading && (
                <div className="text-center py-8 lg:py-12 text-gray-500 px-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <Search className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-sm lg:text-base">No conversations found</p>
                  <p className="text-xs lg:text-sm">Start a new conversation to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`chat-area w-full lg:flex-1 flex flex-col ${
            showChatArea ? 'flex' : 'hidden lg:flex'
          }`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3 lg:p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
                      <button
                        onClick={handleBackToList}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg">
                          {getOtherParticipant(selectedConversation)?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 lg:gap-2 mb-0.5 lg:mb-1">
                          <h3 className="font-bold text-gray-900 text-sm lg:text-lg truncate">
                            {getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2 text-xs text-gray-500 mt-0.5 lg:mt-1">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500"></div>
                          <span>Online now</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                      <button 
                        onClick={() => initiateCall(false)}
                        className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Phone className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                      <button 
                        onClick={() => initiateCall(true)}
                        className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Video className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-4 lg:space-y-6 bg-gradient-to-b from-white/30 to-blue-50/30">
                  {loading ? (
                    <div className="text-center py-8">Loading messages...</div>
                  ) : messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2.5 lg:px-6 lg:py-4 rounded-2xl lg:rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.isMe
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-between mt-2 lg:mt-3 text-xs ${
                          message.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.isMe && (
                            <div className="ml-2 lg:ml-3">
                              {message.status === 'read' ? (
                                <CheckCheck className="w-3 h-3 lg:w-4 lg:h-4 text-blue-200" />
                              ) : message.status === 'delivered' ? (
                                <Check className="w-3 h-3 lg:w-4 lg:h-4 text-blue-200" />
                              ) : (
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-blue-200" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 lg:p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <button className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0">
                      <Paperclip className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-4 py-2.5 lg:px-6 lg:py-4 border border-gray-200 rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-base"
                        style={{ fontSize: '16px' }}
                        disabled={sending}
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl lg:rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center flex-shrink-0"
                    >
                      <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-center">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl">
                    <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">Select a Conversation</h3>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">Choose a client from the left to start messaging</p>
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