import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Phone,
  Video,
  Paperclip,
  ArrowLeft,
  CheckCheck,
  Check,
  Clock,
  MessageSquare,
  Plus
} from 'lucide-react';

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
  providerId?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isMe?: boolean;
  senderType?: 'customer' | 'provider';
}

interface MessagesProps {
  chatState: ChatState;
  onSendMessage: (conversationId: string, content: string) => void;
  onStartConversation: (providerId: string) => Promise<string | void> | string | void;
  onSetActiveConversation: (conversationId: string) => void;
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = ({
  chatState,
  onSendMessage,
  onStartConversation,
  onSetActiveConversation,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'online'>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeConversation = chatState.conversations.find(
    conv => conv.id === chatState.activeConversation
  );

  const currentMessages = chatState.activeConversation 
    ? chatState.messages[chatState.activeConversation] || []
    : [];

  // DEBUG: Log current user ID and message data
  useEffect(() => {
    if (currentMessages.length > 0) {
      console.log('=== DEBUG MESSAGE DATA ===');
      console.log('Current User ID:', currentUserId);
      console.log('Active Conversation:', activeConversation);
      console.log('All Messages:', currentMessages);
      
      currentMessages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`, {
          content: msg.content,
          senderId: msg.senderId,
          currentUserId: currentUserId,
          isSame: msg.senderId === currentUserId,
          isMe: msg.senderId === currentUserId
        });
      });
    }
  }, [currentMessages, currentUserId, activeConversation]);

  // FIXED: Proper message alignment with debug logging
  const messagesWithAlignment: Message[] = currentMessages.map(message => {
    // CRITICAL FIX: Compare string values properly
    const isMe = message.senderId.toString() === currentUserId.toString();
    
    const senderType: 'customer' | 'provider' = isMe ? 'customer' : 'provider';
    
    console.log(`Message Alignment: "${message.content}" | Sender: ${message.senderId} | CurrentUser: ${currentUserId} | IsMe: ${isMe} | Type: ${senderType}`);
    
    return {
      ...message,
      isMe,
      senderType
    };
  });

  const filteredConversations = chatState.conversations.filter(conv => {
    const matchesSearch = conv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.providerService.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conv.unreadCount > 0) ||
                         (filterType === 'online' && conv.isOnline);
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

  // FIXED: Simplified alignment logic
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

  const totalUnread = chatState.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineCount = chatState.conversations.filter(conv => conv.isOnline).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)] flex">
          {/* Conversations List */}
          <div className={`w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            showMobileConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="p-6 border-b border-gray-200 bg-white/50">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      filterType === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({chatState.conversations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      filterType === 'unread' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread ({totalUnread})
                  </button>
                  <button
                    onClick={() => setFilterType('online')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      filterType === 'online' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500 px-4">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium">No conversations found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group ${
                        chatState.activeConversation === conversation.id 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                            {conversation.providerName.charAt(0)}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                {conversation.providerName}
                              </h4>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Provider
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>{conversation.providerService}</span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${
            !showMobileConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {activeConversation ? (
              <>
                <div className="p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <button
                        onClick={() => setShowMobileConversation(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {activeConversation.providerName.charAt(0)}
                        </div>
                        {activeConversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{activeConversation.providerName}</h3>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Provider
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{activeConversation.providerService}</span>
                          <span>•</span>
                          <span>{activeConversation.isOnline ? 'Online now' : `Last seen ${formatLastSeen(activeConversation.lastSeen)}`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="w-12 h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area - FIXED ALIGNMENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/30 to-blue-50/30">
                  {messagesWithAlignment.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="font-medium">No messages yet</p>
                      <p className="text-sm">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    messagesWithAlignment.map((message) => {
                      const alignment = getMessageAlignment(message);
                      const messageStyle = getMessageStyle(message);
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${alignment === 'right' ? 'justify-end' : 'justify-start'} mb-4`}
                        >
                          <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm relative ${messageStyle}`}>
                            {/* Only show sender label for provider messages */}
                            {!message.isMe && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-500">
                                  Provider
                                </span>
                              </div>
                            )}
                            
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className={`flex items-center justify-end mt-2 text-xs gap-1 ${
                              alignment === 'right' ? 'text-blue-100' : 'text-gray-500'
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

                <div className="p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-center space-x-4">
                    <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={`w-12 h-12 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                        messageInput.trim()
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-110'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Provider</h3>
                  <p className="text-gray-600 mb-4">Choose a service provider to start messaging</p>
                  <button 
                    onClick={() => onStartConversation('new')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
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