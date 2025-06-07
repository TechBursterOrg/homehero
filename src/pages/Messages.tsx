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
  ArrowLeft
} from 'lucide-react';

interface MessagesProps {
  notifications: number;
  setNotifications: (count: number) => void;
}

const Messages: React.FC<MessagesProps> = ({ notifications, setNotifications }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatArea, setShowChatArea] = useState(false);

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
      job: 'House Cleaning - Oak Street'
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
      job: 'Plumbing Repair - Pine Avenue'
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
      job: 'Garden Maintenance - Elm Drive'
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
      job: 'Bathroom Deep Clean - Maple Street'
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

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
      
      // Clear notifications when sending a message
      if (notifications > 0) {
        setNotifications(0);
      }
    }
  };

  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId);
    setShowChatArea(true); // Show chat area on mobile when conversation is selected
    
    // Mark messages as read
    const conv = conversations.find(c => c.id === chatId);
    if (conv && conv.unread > 0) {
      conv.unread = 0;
      // Update total notifications
      const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
      setNotifications(totalUnread);
    }
  };

  const handleBackToList = () => {
    setShowChatArea(false);
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-100 flex">
      {/* Conversations List */}
      <div className={`conversation-list w-full lg:w-1/3 border-r border-gray-200 flex flex-col ${
        showChatArea ? 'chat-active' : ''
      }`}>
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectChat(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{conversation.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{conversation.rating}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 truncate">{conversation.job}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`chat-area w-full lg:flex-1 flex flex-col ${
        showChatArea ? 'chat-active' : ''
      }`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Back button - only visible on mobile */}
                <button
                  onClick={handleBackToList}
                  className="back-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedConversation.avatar}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{selectedConversation.job}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 text-xs ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{message.time}</span>
                      {message.isMe && (
                        <div className="ml-2">
                          {message.status === 'read' ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : message.status === 'delivered' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;