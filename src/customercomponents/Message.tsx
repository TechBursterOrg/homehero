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
  CheckCheck,
  Check,
  Clock,
  MessageSquare,
  Plus,
  Calendar,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  VideoOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

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

// Enhanced calling modal component (copied from ProviderCard)
interface CallingModalProps {
  isOpen: boolean;
  provider: Conversation;
  onClose: () => void;
  callType: 'audio' | 'video';
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const CallingModal: React.FC<CallingModalProps> = ({ isOpen, provider, onClose, callType }) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    if (callState === 'connecting') {
      const connectTimeout = setTimeout(() => {
        setCallState('connected');
        startCallTimer();
      }, 2000);

      // Initialize media for both audio and video calls
      initializeMedia();

      return () => {
        clearTimeout(connectTimeout);
      };
    }

    // Cleanup on unmount or when modal closes
    return cleanup;
  }, [isOpen, callState, callType]);

  const initializeMedia = async () => {
    try {
      setError('');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      setStream(mediaStream);
      
      // Set up local video only for video calls
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = mediaStream;
      }
      
      // Create mock remote video only for video calls
      if (remoteVideoRef.current && callType === 'video') {
        createMockRemoteVideo();
      }

      console.log(`${callType} call media initialized successfully`);
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      let errorMessage = 'Could not access camera/microphone.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera/microphone access denied. Please allow permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Media devices not supported in this browser.';
      }
      
      setError(errorMessage);
    }
  };

  const createMockRemoteVideo = () => {
    if (!remoteVideoRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a simple animated background
        let frame = 0;
        const animate = () => {
          // Gradient background matching ProviderCard colors
          const gradient = ctx.createLinearGradient(0, 0, 640, 480);
          gradient.addColorStop(0, '#2563EB'); // blue-600
          gradient.addColorStop(1, '#9333EA'); // purple-600
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 640, 480);
          
          // Provider avatar/initials
          ctx.fillStyle = 'white';
          ctx.font = 'bold 64px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = provider.providerAvatar || provider.providerName.split(' ').map(n => n[0]).join('').toUpperCase();
          ctx.fillText(initials, 320, 220);
          
          // Provider name
          ctx.font = 'bold 24px Arial';
          ctx.fillText(provider.providerName, 320, 300);
          
          // Service type
          ctx.font = '18px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(provider.providerService || 'Service Provider', 320, 330);
          
          // Animated "calling" indicator
          const opacity = (Math.sin(frame * 0.1) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.font = '16px Arial';
          ctx.fillText('● Connected', 320, 380);
          
          frame++;
          
          if (callState === 'connected') {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
        const videoStream = canvas.captureStream(30);
        remoteVideoRef.current.srcObject = videoStream;
      }
    } catch (err) {
      console.error('Error creating mock video:', err);
    }
  };

  const startCallTimer = () => {
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    cleanup();
    
    setTimeout(() => {
      onClose();
      setCallState('connecting');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setIsVideoOn(callType === 'video');
      setError('');
    }, 1500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-white/20">
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Video Call Interface */}
        {callType === 'video' && callState === 'connected' && !error && (
          <div className="relative mb-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl" style={{ height: '400px' }}>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-28 h-20 sm:w-32 sm:h-24 bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/80 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              {/* Fallback if no local video */}
              {(!stream || !isVideoOn) && (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-xs">You</span>
                </div>
              )}
            </div>
            
            {/* Provider Info Overlay */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg sm:text-xl">{provider.providerName}</h3>
              <p className="text-sm opacity-75">{provider.providerService}</p>
            </div>
          </div>
        )}

        {/* Audio Call Interface */}
        {callType === 'audio' && (
          <div className="text-center mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-4xl mx-auto mb-4 shadow-xl">
              {provider.providerAvatar || provider.providerName.charAt(0)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{provider.providerName}</h2>
            <p className="text-gray-600 mb-2">{provider.providerService}</p>
          </div>
        )}

        {/* Call Status */}
        <div className="text-center mb-6">
          {callState === 'connecting' && (
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 text-sm sm:text-base">Connecting...</span>
            </div>
          )}
          
          {callState === 'connected' && !error && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-600 font-bold text-sm sm:text-base">Connected</span>
              <span className="text-gray-600 text-sm sm:text-base">• {formatDuration(callDuration)}</span>
            </div>
          )}
          
          {callState === 'ended' && (
            <div className="text-center space-y-2">
              <span className="text-gray-600 text-sm sm:text-base">Call ended</span>
              <p className="text-gray-500 text-xs sm:text-sm">Duration: {formatDuration(callDuration)}</p>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-3 sm:space-x-4">
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              disabled={!!error}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                isVideoOn 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}
              title={isVideoOn ? 'Turn off video' : 'Turn on video'}
            >
              {isVideoOn ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          )}
          
          <button
            onClick={toggleMute}
            disabled={!!error}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
              isMuted 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
            >
            {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          
          <button
            onClick={toggleSpeaker}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:scale-105 ${
              isSpeakerOn 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isSpeakerOn ? 'Speaker on' : 'Speaker off'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          
          <button
            onClick={handleEndCall}
            className="p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:scale-105"
            title="End call"
          >
            <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

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
  
  // Call functionality states
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showVideoCallOptions, setShowVideoCallOptions] = useState(false);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callButtonRef = useRef<HTMLButtonElement>(null);
  const videoCallButtonRef = useRef<HTMLButtonElement>(null);
  const callOptionsRef = useRef<HTMLDivElement>(null);
  const videoCallOptionsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Phone numbers mapping (similar to ProviderCard)
  const phoneNumbers: { [key: string]: string } = {
    '1': '+1 (555) 123-4567',
    '2': '+1 (555) 234-5678',
    '3': '+1 (555) 345-6789',
    '4': '+1 (555) 456-7890',
    '5': '+1 (555) 567-8901',
    '6': '+1 (555) 678-9012'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Check if we have a provider from navigation state to start a conversation
    if (location.state?.provider) {
      const { provider } = location.state;
      handleStartConversationWithProvider(provider);
    }
  }, [chatState.messages, chatState.activeConversation, location.state]);

  const handleStartConversationWithProvider = async (provider: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          participantId: provider._id || provider.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onSetActiveConversation(result.data.conversation._id);
        setShowMobileConversation(true);
      } else {
        console.error('Failed to create conversation:', result.message);
        alert('Failed to start conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Error starting conversation. Please try again.');
    }
  };

  // Close call options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        callOptionsRef.current && 
        !callOptionsRef.current.contains(event.target as Node) &&
        callButtonRef.current && 
        !callButtonRef.current.contains(event.target as Node)
      ) {
        setShowCallOptions(false);
      }
      
      if (
        videoCallOptionsRef.current && 
        !videoCallOptionsRef.current.contains(event.target as Node) &&
        videoCallButtonRef.current && 
        !videoCallButtonRef.current.contains(event.target as Node)
      ) {
        setShowVideoCallOptions(false);
      }
    };

    if (showCallOptions || showVideoCallOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCallOptions, showVideoCallOptions]);

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
                         (filterType === 'urgent');
    return matchesSearch && matchesFilter;
  });

  // Call handling functions
  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCallOptions(!showCallOptions);
    setShowVideoCallOptions(false);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVideoCallOptions(!showVideoCallOptions);
    setShowCallOptions(false);
  };

  const handleWebCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCallOptions(false);
    setShowVideoCallOptions(false);
    setShowCallingModal(true);
  };

  const handlePhoneCall = () => {
    if (!activeConversation) return;
    
    const providerPhone = phoneNumbers[activeConversation.id] || '+1 (555) 000-0000';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cleanPhoneNumber = providerPhone.replace(/\D/g, '');
    
    if (isMobile) {
      window.location.href = `tel:${cleanPhoneNumber}`;
    } else {
      window.open(`tel:${cleanPhoneNumber}`);
    }
    setShowCallOptions(false);
    setShowVideoCallOptions(false);
  };

  const handleCopyNumber = async () => {
    if (!activeConversation) return;
    
    const providerPhone = phoneNumbers[activeConversation.id] || '+1 (555) 000-0000';
    
    try {
      await navigator.clipboard.writeText(providerPhone);
      alert('Phone number copied to clipboard!');
    } catch {
      prompt('Copy this phone number:', providerPhone);
    }
    setShowCallOptions(false);
    setShowVideoCallOptions(false);
  };

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
          return <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-blue-300" />;
        case 'delivered':
          return <Check className="w-3 h-3 lg:w-4 lg:h-4 text-blue-300" />;
        case 'read':
          return <CheckCheck className="w-3 h-3 lg:w-4 lg:h-4 text-blue-200" />;
        default:
          return null;
      }
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalUnread = chatState.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineCount = chatState.conversations.filter(conv => conv.isOnline).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
          {/* Mobile-First Header - Updated Colors */}
          

          {/* Main Messages Interface */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)] lg:h-[calc(100vh-400px)] min-h-[500px] lg:min-h-[600px] flex">
            {/* Conversations List */}
            <div className={`w-full lg:w-2/5 border-r border-gray-200 flex flex-col ${
              showMobileConversation ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* Search and Filters */}
              <div className="p-3 lg:p-6 border-b border-gray-200 bg-white/50">
                <div className="space-y-3 lg:space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2.5 lg:py-3 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-sm"
                    />
                  </div>
                  
                  {/* Filter Pills - Updated Colors */}
                  <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        filterType === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

              {/* Conversation List */}
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
                        className={`w-full p-3 lg:p-6 rounded-xl lg:rounded-2xl text-left transition-all duration-300 group ${
                          chatState.activeConversation === conversation.id 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3 lg:space-x-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {conversation.providerAvatar || getInitials(conversation.providerName)}
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
                 <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm lg:text-base truncate">
                                {conversation.providerName}
                              </h4>
                              <span className="text-xs text-gray-500 font-medium flex-shrink-0">{formatTime(conversation.lastMessage.timestamp)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3 p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-blue-100 bg-blue-50">
                              <span className="text-sm lg:text-lg flex-shrink-0">{getCategoryIcon(conversation.providerService)}</span>
                              <span className="text-xs lg:text-sm text-blue-600 font-medium truncate">{conversation.providerService}</span>
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

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${
              !showMobileConversation ? 'hidden lg:flex' : 'flex'
            }`}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
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
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg">
                            {activeConversation.providerAvatar || getInitials(activeConversation.providerName)}
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
                        {/* Enhanced Phone Call Button with Dropdown */}
                        <div className="relative">
                          <button 
                            ref={callButtonRef}
                            onClick={handleCallClick}
                            className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <Phone className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                          </button>
                          
                          {showCallOptions && (
                            <div 
                              ref={callOptionsRef}
                              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[200] min-w-48 pointer-events-auto"
                            >
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleWebCall('audio');
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <PhoneCall className="w-4 h-4 text-green-600" />
                                <span>Web Audio Call</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePhoneCall();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span>Phone App</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCopyNumber();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                                <span>Copy Number</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Video Call Button with Dropdown */}
                        <div className="relative">
                          <button 
                            ref={videoCallButtonRef}
                            onClick={handleVideoClick}
                            className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <Video className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                          </button>
                          
                          {showVideoCallOptions && (
                            <div 
                              ref={videoCallOptionsRef}
                              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[200] min-w-48 pointer-events-auto"
                            >
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleWebCall('video');
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Video className="w-4 h-4 text-blue-600" />
                                <span>Web Video Call</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePhoneCall();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span>Phone App</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCopyNumber();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <PhoneCall className="w-4 h-4 text-green-600" />
                                <span>Web Audio Call</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePhoneCall();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span>Phone App</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCopyNumber();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                                <span>Copy Number</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Video Call Button with Dropdown */}
                        <div className="relative">
                          <button 
                            ref={videoCallButtonRef}
                            onClick={handleVideoClick}
                            className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <Video className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                          </button>
                          
                          {showVideoCallOptions && (
                            <div 
                              ref={videoCallOptionsRef}
                              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[200] min-w-48 pointer-events-auto"
                            >
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleWebCall('video');
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Video className="w-4 h-4 text-blue-600" />
                                <span>Web Video Call</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePhoneCall();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span>Phone App</span>
                              </button>
                              
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCopyNumber();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                                <span>Copy Number</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <button className="hidden sm:flex w-8 h-8 lg:w-12 lg:h-12 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-xl lg:rounded-2xl items-center justify-center transition-all duration-200 hover:scale-110">
                          <Calendar className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                        </button>
                        <button className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                          <MoreVertical className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages - Updated with Blue-Purple Theme */}
                  <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-4 lg:space-y-6 bg-gradient-to-b from-white/30 to-blue-50/30">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2.5 lg:px-6 lg:py-4 rounded-2xl lg:rounded-3xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          message.senderId === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-blue-100'
                        }`}>
                          <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center justify-between mt-2 lg:mt-3 text-xs ${
                            message.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="font-medium">{formatTime(message.timestamp)}</span>
                            {renderMessageStatus(message)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
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
                          className="w-full px-4 py-2.5 lg:px-6 lg:py-4 border border-gray-200 rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 resize-none text-sm"
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
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-110 hover:shadow-xl'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl">
                      <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">Select a Provider</h3>
                    <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">Choose a service provider from the left to start messaging</p>
                    <button 
                      onClick={() => onStartConversation('new')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto text-sm lg:text-base"
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

      {/* Calling Modal */}
      {showCallingModal && activeConversation && (
        <CallingModal
          isOpen={showCallingModal}
          provider={activeConversation}
          onClose={() => setShowCallingModal(false)}
          callType={callType}
        />
      )}
    </>
  );
};

export default Messages;