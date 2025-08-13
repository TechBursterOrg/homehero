import React, { useState } from 'react';
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
}

const Messages: React.FC<MessagesProps> = ({ notifications = 3, setNotifications = () => {} }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatArea, setShowChatArea] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'online'>('all');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thank you so much! The house looks amazing. When can you come next week?',
      time: '2:30 PM',
      unread: 2,
      online: true,
      avatar: 'SJ',
      rating: 4.9,
      job: 'House Cleaning - Oak Street',
      priority: 'high',
      category: 'cleaning'
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Perfect! See you tomorrow at 2 PM for the plumbing repair.',
      time: '1:15 PM',
      unread: 0,
      online: false,
      avatar: 'MC',
      rating: 4.8,
      job: 'Plumbing Repair - Pine Avenue',
      priority: 'medium',
      category: 'handyman'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      lastMessage: 'Could we reschedule to Thursday morning instead?',
      time: '11:45 AM',
      unread: 1,
      online: true,
      avatar: 'EW',
      rating: 4.7,
      job: 'Garden Maintenance - Elm Drive',
      priority: 'low',
      category: 'gardening'
    },
    {
      id: 4,
      name: 'David Brown',
      lastMessage: 'Great work on the bathroom! I\'ll leave a 5-star review.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'DB',
      rating: 5.0,
      job: 'Bathroom Deep Clean - Maple Street',
      priority: 'medium',
      category: 'cleaning'
    },
    {
      id: 5,
      name: 'Lisa Martinez',
      lastMessage: 'Hi! I need urgent electrical work done this week.',
      time: '10:20 AM',
      unread: 1,
      online: true,
      avatar: 'LM',
      rating: 4.6,
      job: 'Electrical Work - Main Street',
      priority: 'high',
      category: 'electrical'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi Alex! I saw your profile and I\'m interested in your house cleaning service.',
      time: '9:30 AM',
      isMe: false,
      status: 'read'
    },
    {
      id: 2,
      sender: 'me',
      content: 'Hi Sarah! Thank you for reaching out. I\'d be happy to help with your house cleaning needs. What specific areas would you like me to focus on?',
      time: '9:35 AM',
      isMe: true,
      status: 'read'
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'I need a deep clean for my 3-bedroom house. Kitchen, bathrooms, living areas, and bedrooms. How much would that be?',
      time: '9:40 AM',
      isMe: false,
      status: 'read'
    },
    {
      id: 4,
      sender: 'me',
      content: 'For a 3-bedroom deep clean, I charge $75-85 depending on the current condition. It typically takes 3-4 hours. I can come this Friday morning if that works for you?',
      time: '9:45 AM',
      isMe: true,
      status: 'read'
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      content: 'Friday morning sounds perfect! Let\'s say 10 AM? My address is 123 Oak Street.',
      time: '10:00 AM',
      isMe: false,
      status: 'read'
    },
    {
      id: 6,
      sender: 'me',
      content: 'Perfect! I\'ll be there Friday at 10 AM. I\'ll bring all my cleaning supplies. Looking forward to working with you!',
      time: '10:05 AM',
      isMe: true,
      status: 'read'
    },
    {
      id: 7,
      sender: 'Sarah Johnson',
      content: 'Thank you so much! The house looks amazing. When can you come next week?',
      time: '2:30 PM',
      isMe: false,
      status: 'delivered'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      case 'electrical': return '⚡';
      default: return '💼';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-amber-400 bg-amber-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-blue-400 bg-blue-50';
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.job.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conv.unread > 0) ||
                         (filterType === 'online' && conv.online);
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);
  const onlineCount = conversations.filter(conv => conv.online).length;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
      
      if (notifications > 0) {
        setNotifications(0);
      }
    }
  };

  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId);
    setShowChatArea(true);
    
    const conv = conversations.find(c => c.id === chatId);
    if (conv && conv.unread > 0) {
      conv.unread = 0;
      const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
      setNotifications(totalUnread);
    }
  };

  const handleBackToList = () => {
    setShowChatArea(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Messages & Communication 💬
                  </h1>
                  <p className="text-gray-600 text-lg">Stay connected with your clients and manage conversations</p>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-green-200 flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="text-3xl font-bold text-gray-900">{conversations.length}</p>
              <div className="text-sm text-blue-600 font-semibold">
                Active clients
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-red-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">{totalUnread}</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-red-600 font-semibold">Needs response</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Online Clients</p>
              <p className="text-3xl font-bold text-gray-900">{onlineCount}</p>
              <div className="text-sm text-green-600 font-semibold">
                Available now
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white fill-current" />
              </div>
              <div className="text-purple-600">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">4.8 ⭐</p>
              <div className="text-sm text-purple-600 font-semibold">
                Client satisfaction
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Messages Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-400px)] min-h-[600px] flex">
          {/* Conversations List */}
          <div className={`conversation-list w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
            showChatArea ? 'chat-active' : ''
          }`}>
            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-white/50">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      filterType === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({conversations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      filterType === 'unread' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread ({totalUnread})
                  </button>
                  <button
                    onClick={() => setFilterType('online')}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      filterType === 'online' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectChat(conversation.id)}
                  className={`group p-6 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${
                    selectedChat === conversation.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {conversation.avatar}
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg">
                          <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                      {conversation.unread > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {conversation.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 font-medium">{conversation.rating}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{conversation.time}</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 mb-3 p-2 rounded-xl border-l-4 ${getPriorityColor(conversation.priority)}`}>
                        <span className="text-lg">{getCategoryIcon(conversation.category)}</span>
                        <span className="text-sm text-gray-600 font-medium truncate">{conversation.job}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate font-medium">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredConversations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">No conversations found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Chat Area */}
          <div className={`chat-area w-full lg:flex-1 flex flex-col ${
            showChatArea ? 'chat-active' : ''
          }`}>
            {selectedConversation ? (
              <>
                {/* Enhanced Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleBackToList}
                        className="back-button p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold shadow-lg">
                          {selectedConversation.avatar}
                        </div>
                        {selectedConversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{selectedConversation.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 font-medium">{selectedConversation.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-lg">{getCategoryIcon(selectedConversation.category)}</span>
                          <span className="font-medium">{selectedConversation.job}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <div className={`w-2 h-2 rounded-full ${selectedConversation.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span>{selectedConversation.online ? 'Online now' : 'Last seen 2h ago'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="w-12 h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/30 to-blue-50/30">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.isMe
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-between mt-3 text-xs ${
                          message.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">{message.time}</span>
                          {message.isMe && (
                            <div className="ml-3">
                              {message.status === 'read' ? (
                                <CheckCheck className="w-4 h-4 text-blue-200" />
                              ) : message.status === 'delivered' ? (
                                <Check className="w-4 h-4 text-blue-200" />
                              ) : (
                                <Clock className="w-4 h-4 text-blue-200" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Message Input */}
                <div className="p-6 border-t border-gray-200 bg-white/50">
                  <div className="flex items-center space-x-4">
                    <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-sm"
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <MessageSquare className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-gray-600 mb-6">Choose a client from the left to start messaging</p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    <span>Start New Chat</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .conversation-list {
            display: block;
          }
          .chat-area {
            display: none;
          }
          .conversation-list.chat-active {
            display: none;
          }
          .chat-area.chat-active {
            display: flex;
          }
          .back-button {
            display: flex;
          }
        }
        @media (min-width: 1025px) {
          .back-button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;