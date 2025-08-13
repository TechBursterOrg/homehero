import React, { useState, useRef, useEffect } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Heart,
  Shield,
  Award,
  MessageCircle,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Copy,
  ExternalLink,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Provider, ServiceType } from '../types';

export interface ProviderCardProps {
  provider: Provider;
  serviceType: ServiceType;
  onBook: (provider: Provider) => void;
  onToggleFavorite: (providerId: string) => void;
  onMessage: (provider: Provider) => void;
  onCall: (provider: Provider) => void;
  isFavorite: boolean;
}

// Enhanced calling modal component
interface CallingModalProps {
  isOpen: boolean;
  provider: Provider;
  onClose: () => void;
  callType: 'audio' | 'video';
}

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
          // Gradient background
          const gradient = ctx.createLinearGradient(0, 0, 640, 480);
          gradient.addColorStop(0, '#4F46E5');
          gradient.addColorStop(1, '#7C3AED');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 640, 480);
          
          // Provider avatar/initials
          ctx.fillStyle = 'white';
          ctx.font = 'bold 64px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = provider.avatar || provider.name.split(' ').map(n => n[0]).join('').toUpperCase();
          ctx.fillText(initials, 320, 220);
          
          // Provider name
          ctx.font = 'bold 24px Arial';
          ctx.fillText(provider.name, 320, 300);
          
          // Service type
          ctx.font = '18px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(provider.services[0] || 'Service Provider', 320, 330);
          
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
        track.enabled = isMuted; // This will unmute if currently muted
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn; // This will turn on if currently off
      });
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, you'd use HTMLMediaElement.setSinkId() if supported
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
              <h3 className="font-bold text-lg sm:text-xl">{provider.name}</h3>
              <p className="text-sm opacity-75">{provider.services[0]}</p>
            </div>
          </div>
        )}

        {/* Audio Call Interface */}
        {callType === 'audio' && (
          <div className="text-center mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-4xl mx-auto mb-4 shadow-xl">
              {provider.avatar || provider.name.charAt(0)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{provider.name}</h2>
            <p className="text-gray-600 mb-2">{provider.services[0]}</p>
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

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  serviceType,
  onBook,
  onToggleFavorite,
  onMessage,
  onCall,
  isFavorite
}) => {
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const callButtonRef = useRef<HTMLButtonElement>(null);
  const callOptionsRef = useRef<HTMLDivElement>(null);

  const phoneNumbers: { [key: string]: string } = {
    '1': '+1 (555) 123-4567',
    '2': '+1 (555) 234-5678',
    '3': '+1 (555) 345-6789',
    '4': '+1 (555) 456-7890',
    '5': '+1 (555) 567-8901',
    '6': '+1 (555) 678-9012'
  };

  const providerPhone = phoneNumbers[provider.id] || '+1 (555) 000-0000';

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCallOptions(!showCallOptions);
  };

  const handleWebCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCallOptions(false);
    setShowCallingModal(true);
    onCall(provider);
  };

  const handlePhoneCall = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cleanPhoneNumber = providerPhone.replace(/\D/g, '');
    
    if (isMobile) {
      window.location.href = `tel:${cleanPhoneNumber}`;
    } else {
      window.open(`tel:${cleanPhoneNumber}`);
    }
    setShowCallOptions(false);
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(providerPhone);
      alert('Phone number copied to clipboard!');
    } catch {
      const userInput = prompt('Copy this phone number:', providerPhone);
      // User can manually copy from the prompt
    }
    setShowCallOptions(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
    };

    if (showCallOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCallOptions]);

  return (
    <>
      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 sm:p-6 overflow-hidden relative">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-4">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
              {provider.avatar || getInitials(provider.name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {provider.name}
                    </h3>
                    {provider.isVerified && (
                      <Shield className="w-3 h-3 text-blue-500 shrink-0" />
                    )}
                    {provider.isTopRated && (
                      <Award className="w-3 h-3 text-yellow-500 shrink-0" />
                    )}
                  </div>
                  
                  {provider.isAvailableNow && serviceType === 'immediate' && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-sm mb-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Available Now</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onToggleFavorite(provider.id)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {renderStars(provider.rating)}
                </div>
                <span className="text-sm font-bold text-gray-900">{provider.rating}</span>
                <span className="text-xs text-gray-500">({provider.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1">
            {provider.services.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                +{provider.services.length - 2} more
              </span>
            )}
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{provider.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{provider.responseTime}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-lg font-bold text-emerald-600">{provider.priceRange}</p>
              <p className="text-xs text-gray-500">{provider.completedJobs} jobs</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onMessage(provider)}
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              <div className="relative">
                <button 
                  ref={callButtonRef}
                  onClick={handleCallClick}
                  className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                </button>
                
                {showCallOptions && (
                  <div 
                    ref={callOptionsRef}
                    className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[200] min-w-48 pointer-events-auto"
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
                      <ExternalLink className="w-4 h-4 text-purple-600" />
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
              
              <button
                onClick={() => onBook(provider)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
              >
                {serviceType === 'immediate' ? 'Book' : 'Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
            {provider.avatar || getInitials(provider.name)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {provider.name}
                  </h3>
                  {provider.isVerified && (
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  {provider.isTopRated && (
                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                  )}
                  {provider.isAvailableNow && serviceType === 'immediate' && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-xl text-sm font-semibold shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Available Now</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{provider.rating}</span>
                  <span className="text-sm text-gray-600">({provider.reviewCount} reviews)</span>
                </div>
              </div>
              
              <button
                onClick={() => onToggleFavorite(provider.id)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap gap-2">
                {provider.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl"
                  >
                    {service}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span>Responds {provider.responseTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-emerald-600">{provider.priceRange}</p>
                <p className="text-sm text-gray-500">{provider.completedJobs} jobs completed</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onMessage(provider)}
                  className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button 
                    ref={callButtonRef}
                    onClick={handleCallClick}
                    className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  
                  {showCallOptions && (
                    <div 
                      ref={callOptionsRef}
                      className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[200] min-w-48 pointer-events-auto"
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
                        <ExternalLink className="w-4 h-4 text-purple-600" />
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
                
                <button
                  onClick={() => onBook(provider)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {serviceType === 'immediate' ? 'Book Now' : 'Get Quote'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
      </div>

      <CallingModal
        isOpen={showCallingModal}
        provider={provider}
        onClose={() => setShowCallingModal(false)}
        callType={callType}
      />
    </>
  );
};

export default ProviderCard;