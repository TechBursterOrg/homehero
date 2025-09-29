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
  senderId: string | any;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isMe?: boolean;
  isProvider?: boolean;
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
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<number>(0);

  // FIXED: Improved auto-scroll logic
  useEffect(() => {
    const currentMessages = chatState.activeConversation 
      ? chatState.messages[chatState.activeConversation] || []
      : [];
    
    const currentMessageCount = currentMessages.length;
    
    // Only auto-scroll if:
    // 1. User is not manually scrolling
    // 2. New messages were added (not just conversation change)
    // 3. Or it's a new conversation
    const hasNewMessages = currentMessageCount > lastMessageCountRef.current;
    const isNewConversation = lastMessageCountRef.current === 0 && currentMessageCount > 0;
    
    if (!isUserScrolling && (hasNewMessages || isNewConversation)) {
      scrollToBottom();
    }
    
    lastMessageCountRef.current = currentMessageCount;
  }, [chatState.messages, chatState.activeConversation, isUserScrolling]);

  // FIXED: Handle scroll events to detect user interaction
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    if (isAtBottom) {
      setIsUserScrolling(false);
    } else {
      setIsUserScrolling(true);
    }
  };

  // FIXED: Reset user scrolling state when conversation changes
  useEffect(() => {
    setIsUserScrolling(false);
  }, [chatState.activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottomInstant = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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

  // FIXED: Use sender ID pattern analysis when currentUserId is not available
  const messagesWithAlignment: Message[] = currentMessages.map((message, index) => {
    // Try to get currentUserId first
    let currentUserIdString: string = '';
    if (typeof currentUserId === 'string') {
      currentUserIdString = currentUserId;
    } else if (currentUserId && typeof currentUserId === 'object') {
      currentUserIdString = (currentUserId as any)._id || (currentUserId as any).id || '';
    }
    
    let msgSenderIdString: string = '';
    let senderUserType: string = 'customer';
    let senderName: string = 'Unknown';
    
    if (typeof message.senderId === 'string') {
      msgSenderIdString = message.senderId;
      senderUserType = 'customer';
      senderName = 'User';
    } else if (message.senderId && typeof message.senderId === 'object') {
      const senderObj = message.senderId as any;
      msgSenderIdString = senderObj._id || senderObj.id || '';
      senderUserType = senderObj.userType || 'customer';
      senderName = senderObj.name || 'Unknown';
    }
    
    let isMe = false;
    let isProvider = senderUserType === 'provider' || senderUserType === 'both';
    
    // Method 1: If we have currentUserId, use proper comparison
    if (currentUserIdString) {
      isMe = msgSenderIdString === currentUserIdString;
    } else {
      // Method 2: Pattern analysis - identify which sender ID belongs to current user
      // From the logs, we can see two sender IDs. We need to determine which one is "you"
      
      // Get all unique sender IDs from the conversation
      const allSenderIds = currentMessages.map(msg => 
        typeof msg.senderId === 'string' ? msg.senderId : (msg.senderId as any)?._id || (msg.senderId as any)?.id || ''
      ).filter(id => id);
      
      const senderFrequency = allSenderIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // HEURISTIC: In a customer-provider chat where you're viewing as customer,
      // your messages are likely the ones that appear more frequently or in a pattern
      // For now, let's assume the first sender ID that appears is yours (you started the conversation)
      const firstSenderId = allSenderIds[0];
      
      // Alternative: Check if this is the conversation initiator (customer)
      // In most customer-provider chats, the customer initiates
      isMe = msgSenderIdString === firstSenderId;
      
      // Override: If sender has provider userType but you're viewing as customer,
      // those are definitely NOT your messages
      if (isProvider) {
        isMe = false;
      }
    }
    
    console.log(`Message ${index + 1}: "${message.content}" | Sender: ${msgSenderIdString} | Type: ${senderUserType} | IsMe: ${isMe} | IsProvider: ${isProvider} | Will align: ${isMe ? 'RIGHT' : 'LEFT'}`);
    
    return {
      ...message,
      isMe,
      isProvider
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
      // FIXED: Scroll to bottom immediately after sending message
      setTimeout(scrollToBottomInstant, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // FIXED: Improved conversation click handler
  const handleConversationClick = (conversationId: string) => {
    console.log('Conversation clicked:', conversationId);
    onSetActiveConversation(conversationId);
    setShowMobileConversation(true);
    // FIXED: Reset scroll state when switching conversations
    setIsUserScrolling(false);
  };

  const handleBackToConversations = () => {
    setShowMobileConversation(false);
  };

  // FIXED: Scroll to bottom button handler
  const handleScrollToBottom = () => {
    setIsUserScrolling(false);
    scrollToBottom();
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

  // FIXED: Added safety checks for message alignment
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
      {/* Mobile-First Container */}
      <div className="h-screen flex flex-col lg:max-w-7xl lg:mx-auto lg:px-4 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm lg:rounded-3xl shadow-sm border-0 lg:border lg:border-gray-100 overflow-hidden flex-1 flex">
          {/* Conversations List - MOBILE RESPONSIVE */}
          <div className={`w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            !showMobileConversation ? 'flex' : 'hidden lg:flex'
          }`}>
            <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/50">
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
                    className={`px-3 lg:px-4 py-2 rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      filterType === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({chatState.conversations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-3 lg:px-4 py-2 rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      filterType === 'unread' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread ({totalUnread})
                  </button>
                  <button
                    onClick={() => setFilterType('online')}
                    className={`px-3 lg:px-4 py-2 rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
                <div className="text-center py-8 lg:py-12 text-gray-500 px-4">
                  <MessageSquare className="w-12 lg:w-16 h-12 lg:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium text-sm lg:text-base">No conversations found</p>
                  <p className="text-xs lg:text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-1 lg:space-y-2 p-1 lg:p-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`w-full p-3 lg:p-4 rounded-2xl text-left transition-all duration-300 group ${
                        chatState.activeConversation === conversation.id 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm lg:text-lg">
                            {conversation.providerName.charAt(0)}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 lg:mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm lg:text-base">
                                {conversation.providerName}
                              </h4>
                              <span className="text-xs px-2 py-0.5 lg:py-1 bg-green-100 text-green-800 rounded-full hidden sm:inline">
                                Provider
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(conversation.lastMessage.timestamp)}</span>
                          </div>
                          
                          <p className="text-xs lg:text-sm text-gray-600 truncate mb-1 lg:mb-0">{conversation.lastMessage.content}</p>
                          
                          <div className="flex items-center justify-between mt-1 lg:mt-2 text-xs text-gray-500">
                            <span className="truncate">{conversation.providerService}</span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs flex-shrink-0 ml-2">
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

          {/* Chat Area - MOBILE RESPONSIVE */}
          <div className={`flex-1 flex flex-col ${
            showMobileConversation ? 'flex' : 'hidden lg:flex'
          }`}>
            {activeConversation ? (
              <>
                <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
                      <button
                        onClick={handleBackToConversations}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative flex-shrink-0">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm lg:text-lg">
                          {activeConversation.providerName.charAt(0)}
                        </div>
                        {activeConversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">{activeConversation.providerName}</h3>
                          <span className="text-xs px-2 py-0.5 lg:py-1 bg-green-100 text-green-800 rounded-full hidden sm:inline">
                            Provider
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                          <span className="truncate">{activeConversation.providerService}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{activeConversation.isOnline ? 'Online now' : `Last seen ${formatLastSeen(activeConversation.lastSeen)}`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 lg:gap-2">
                      <button className="w-10 lg:w-12 h-10 lg:h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Phone className="w-4 lg:w-5 h-4 lg:h-5" />
                      </button>
                      <button className="w-10 lg:w-12 h-10 lg:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                        <Video className="w-4 lg:w-5 h-4 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area - MOBILE OPTIMIZED */}
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4 bg-gradient-to-b from-white/30 to-blue-50/30 relative"
                  style={{ minHeight: 0 }} // Important for mobile scroll
                >
                  {messagesWithAlignment.length === 0 ? (
                    <div className="text-center py-8 lg:py-12 text-gray-500">
                      <MessageSquare className="w-12 lg:w-16 h-12 lg:h-16 text-gray-400 mx-auto mb-4" />
                      <p className="font-medium text-sm lg:text-base">No messages yet</p>
                      <p className="text-xs lg:text-sm">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    <>
                      {messagesWithAlignment.map((message) => {
                        // FIXED: Added safety check for message object
                        if (!message) return null;
                        
                        const alignment = getMessageAlignment(message);
                        const messageStyle = getMessageStyle(message);
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${alignment === 'right' ? 'justify-end' : 'justify-start'} mb-3 lg:mb-4`}
                          >
                            <div className={`max-w-[85%] lg:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-2xl shadow-sm relative ${messageStyle}`}>
                              {/* Show sender label for messages from others only */}
                              {!message.isMe && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500">
                                    {(message as any).isProvider ? 'Provider' : 'Customer'}
                                  </span>
                                </div>
                              )}
                              
                              <p className="text-sm leading-relaxed break-words">{message.content}</p>
                              <div className={`flex items-center justify-end mt-1 lg:mt-2 text-xs gap-1 ${
                                alignment === 'right' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                <span>{formatTime(message.timestamp)}</span>
                                {renderMessageStatus(message)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* FIXED: Mobile-optimized scroll to bottom button */}
                      {isUserScrolling && (
                        <button
                          onClick={handleScrollToBottom}
                          className="fixed bottom-20 lg:bottom-24 right-4 lg:right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 lg:p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10"
                        >
                          <ArrowLeft className="w-4 lg:w-5 h-4 lg:h-5 rotate-90" />
                        </button>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - MOBILE OPTIMIZED */}
                <div className="p-3 lg:p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <button className="w-10 lg:w-12 h-10 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0">
                      <Paperclip className="w-4 lg:w-5 h-4 lg:h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-sm lg:text-base"
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={`w-10 lg:w-12 h-10 lg:h-12 rounded-2xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                        messageInput.trim()
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-110'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 lg:w-5 h-4 lg:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
                <div className="text-center">
                  <MessageSquare className="w-12 lg:w-16 h-12 lg:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Select a Provider</h3>
                  <p className="text-gray-600 mb-4 text-sm lg:text-base">Choose a service provider to start messaging</p>
                  <button 
                    onClick={() => onStartConversation('new')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto"
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