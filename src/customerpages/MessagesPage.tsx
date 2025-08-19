import React from 'react';
import { MessageSquare, Users, Clock, CheckCircle2, Search, Settings } from 'lucide-react';
import Messages from '../customercomponents/Message';
import { ChatState, Message } from '../types';

interface MessagesPageProps {
  chatState: ChatState;
  onSendMessage: (conversationId: string, content: string) => void;
  onStartConversation: (providerId: string) => void;
  onSetActiveConversation: (conversationId: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({
  chatState,
  onSendMessage,
  onStartConversation,
  onSetActiveConversation
}) => {
  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-3xl p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-cyan-800 to-blue-800 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium max-w-md">
              Communicate with your service providers and stay connected
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Search Messages</span>
            </button>
            
            <button className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
              <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Chat Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      

      {/* Messages Component */}
      <Messages 
        chatState={chatState}
        onSendMessage={onSendMessage}
        onStartConversation={onStartConversation}
        onSetActiveConversation={onSetActiveConversation}
      />
    </div>
  );
};

export default MessagesPage;