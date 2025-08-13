import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
  Circle,
  CheckCheck,
  Check,
  Clock,
  Star,
  MapPin,
  MessageSquare,
  Users,
  Zap,
  Activity,
  Sparkles,
  ChevronRight,
  Plus,
  Settings,
  Archive,
  Calendar,
  Shield,
  Heart
} from 'lucide-react';

// Mock types for this example - replace with your actual types
interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
}

interface Conversation {
  id: string;
  providerName: string;
  providerService: string;
  providerAvatar: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: Message;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

// Define the props interface
interface MessagesProps {
  chatState: ChatState;
  onSendMessage: (conversationId: string, content: string) => void;
  onStartConversation: (providerId: string) => void;
  onSetActiveConversation: (conversationId: string) => void;
}

const Messages: React.FC<MessagesProps> = ({
  chatState,
  onSendMessage,
  onStartConversation,
  onSetActiveConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'online' | 'urgent'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.activeConversation]);

  // Get active conversation from chatState
  const activeConversation = chatState.conversations.find(
    conv => conv.id === chatState.activeConversation
  );

  // Get messages for active conversation
  const currentMessages = chatState.activeConversation 
    ? chatState.messages[chatState.activeConversation] || []
    : [];

  // Filter conversations based on search and filter type
  const filteredConversations = chatState.conversations.filter(conv => {
    const matchesSearch = conv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.providerService.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conv.unreadCount > 0) ||
                         (filterType === 'online' && conv.isOnline) ||
                         (filterType === 'urgent'); // You might want to add a priority field to Conversation type
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && chatState.activeConversation) {
      onSendMessage(chatState.activeConversation, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = (conversationId: string) => {
    onSetActiveConversation(conversationId);
    setShowMobileConversation(true);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatLastSeen = (date: Date | undefined) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCategoryIcon = (service: string) => {
    // You can enhance this to map services to appropriate icons
    const serviceToIcon: { [key: string]: string } = {
      'Plumbing': '🔧',
      'House Cleaning': '🧽',
      'Gardening': '🌿',
      'Electrical': '⚡',
      'Painting': '🎨',
    };
    
    for (const [key, icon] of Object.entries(serviceToIcon)) {
      if (service.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '💼';
  };

  const renderMessageStatus = (message: Message) => {
    if (message.senderId === 'user') {
      switch (message.status) {
        case 'sent':
          return <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />;
        case 'delivered':
          return <Check className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />;
        case 'read':
          return <CheckCheck className="w-3 h-3 lg:w-4 lg:h-4 text-purple-300" />;
        default:
          return null;
      }
    }
    return null;
  };

  const totalUnread = chatState.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineCount = chatState.conversations.filter(conv => conv.isOnline).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
        {/* Mobile-First Header */}
        <div className="mb-4 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Service Providers 💬
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-lg hidden sm:block">Connect with trusted professionals</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onStartConversation('new')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-purple-200 flex items-center gap-2 lg:gap-3 text-sm lg:text-base"
            >
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span className="hidden sm:inline">Find New Provider</span>
              <span className="sm:hidden">Find Provider</span>
            </button>
          </div>
        </div>

        {/* Main Messages Interface - Mobile Responsive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)] lg:h-[calc(100vh-400px)] min-h-[500px] lg:min-h-[600px] flex">
          {/* Conversations List */}
          <div className={`w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            showMobileConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Search and Filters - Mobile Optimized */}
            <div className="p-3 lg:p-6 border-b border-gray-200 bg-white/50">
              <div className="space-y-3 lg:space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2.5 lg:py-3 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-sm"
                  />
                </div>
                
                {/* Filter Pills - Mobile Responsive */}
                <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      filterType === 'all' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({chatState.conversations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      filterType === 'unread' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread ({totalUnread})
                  </button>
                  <button
                    onClick={() => setFilterType('online')}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      filterType === 'online' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation List - Mobile Optimized */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 lg:py-12 text-gray-500 px-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <Search className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-sm lg:text-base">No providers found</p>
                  <p className="text-xs lg:text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-1 p-1 lg:p-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`w-full p-3 lg:p-6 rounded-xl lg:rounded-2xl text-left transition-all duration-300 ${
                        chatState.activeConversation === conversation.id ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-lg shadow-lg">
                            {conversation.providerAvatar}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 lg:border-3 border-white shadow-lg">
                              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 lg:mb-2">
                            <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-sm lg:text-base truncate">
                              {conversation.providerName}
                            </h4>
                            <span className="text-xs text-gray-500 font-medium flex-shrink-0">{formatTime(conversation.lastMessage.timestamp)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3 p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-gray-200 bg-gray-50">
                            <span className="text-sm lg:text-lg flex-shrink-0">{getCategoryIcon(conversation.providerService)}</span>
                            <span className="text-xs lg:text-sm text-gray-600 font-medium truncate">{conversation.providerService}</span>
                          </div>
                          
                          <p className="text-xs lg:text-sm text-gray-600 truncate font-medium">{conversation.lastMessage.content}</p>
                          
                          <div className="flex items-center justify-between mt-1 lg:mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span>{conversation.isOnline ? 'Online' : formatLastSeen(conversation.lastSeen)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Mobile Responsive */}
          <div className={`flex-1 flex flex-col ${
            !showMobileConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {activeConversation ? (
              <>
                {/* Chat Header - Mobile Optimized */}
                <div className="p-3 lg:p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
                      <button
                        onClick={() => setShowMobileConversation(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg">
                          {activeConversation.providerAvatar}
                        </div>
                        {activeConversation.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-sm lg:text-lg truncate">{activeConversation.providerName}</h3>
                        <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-gray-600">
                          <span className="text-sm lg:text-lg">{getCategoryIcon(activeConversation.providerService)}</span>
                          <span className="font-medium truncate">{activeConversation.providerService}</span>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-4 text-xs text-gray-500 mt-0.5 lg:mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${activeConversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span>{activeConversation.isOnline ? 'Online now' : `Last seen ${formatLastSeen(activeConversation.lastSeen)}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                      <button className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Phone className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                      <button className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Video className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                      <button className="hidden sm:flex w-8 h-8 lg:w-12 lg:h-12 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-xl lg:rounded-2xl items-center justify-center transition-all duration-200 hover:scale-110">
                        <Calendar className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                      <button className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <MoreVertical className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages - Mobile Responsive */}
                <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-4 lg:space-y-6 bg-gradient-to-b from-white/30 to-purple-50/30">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2.5 lg:px-6 lg:py-4 rounded-2xl lg:rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.senderId === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-between mt-2 lg:mt-3 text-xs ${
                          message.senderId === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">{formatTime(message.timestamp)}</span>
                          {renderMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Mobile Responsive */}
                <div className="p-3 lg:p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-end space-x-2 lg:space-x-4">
                    <button className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0">
                      <Paperclip className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-2.5 lg:px-6 lg:py-4 border border-gray-200 rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200 resize-none text-sm"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>
                    
                    <button className="hidden sm:flex w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl lg:rounded-2xl items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0">
                      <Smile className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                        messageInput.trim()
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-110 hover:shadow-xl'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
                <div className="text-center">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl">
                    <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">Select a Provider</h3>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">Choose a service provider from the left to start messaging</p>
                  <button 
                    onClick={() => onStartConversation('new')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto text-sm lg:text-base"
                  >
                    <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Find Provider</span>
                  </button>
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