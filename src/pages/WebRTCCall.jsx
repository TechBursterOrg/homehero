import React, { useEffect, useRef, useState } from 'react';

const WebRTCCall = ({ conversation, currentUser, onEndCall }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (conversation && currentUser) {
      setupPeerConnection();
    }
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [conversation]);

  const setupPeerConnection = async () => {
    try {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const pc = new RTCPeerConnection(configuration);
      
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      // Handle remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to other peer
          sendICECandidate(event.candidate);
        }
      };
      
      setPeerConnection(pc);
    } catch (error) {
      console.error('Error setting up peer connection:', error);
    }
  };

  const sendICECandidate = async (candidate) => {
    // Implement ICE candidate signaling
  };

  const startCall = async (video = false) => {
    setIsVideo(video);
    await setupPeerConnection();
    
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // Send offer to backend
      const token = localStorage.getItem('token');
      const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
      
      await fetch('/api/calls/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: otherParticipant._id,
          offer: offer,
          isVideo: video
        })
      });
      
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-48 bg-gray-800 rounded"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-48 bg-gray-800 rounded"
          />
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isCallActive ? (
            <>
              <button
                onClick={() => startCall(false)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Audio Call
              </button>
              <button
                onClick={() => startCall(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Video Call
              </button>
            </>
          ) : (
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              End Call
            </button>
          )}
          
          <button
            onClick={onEndCall}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebRTCCall;