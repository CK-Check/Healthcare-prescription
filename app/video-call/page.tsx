'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VideoCallProps {
  roomId?: string;
}

export default function VideoCallPage({ roomId }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState(roomId || '');
  const [isJoining, setIsJoining] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the candidate to the remote peer
        console.log('New ICE candidate:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.current = pc;
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);
      initializePeerConnection();

      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      setIsCallActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access camera and microphone. Please check your permissions.');
      console.error('Error accessing media devices:', err);
    }
  };

  const joinCall = async () => {
    if (!roomIdInput) {
      setError('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    try {
      await startCall();
      // Here you would typically connect to your signaling server
      // and exchange SDP offers/answers with the remote peer
      router.push(`/video-call/${roomIdInput}`);
    } catch (err) {
      setError('Failed to join call');
      console.error('Error joining call:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setIsCallActive(false);
    setLocalStream(null);
    setRemoteStream(null);
    router.push('/doctor/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Consultation</h1>
          <Link href="/doctor/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isCallActive ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Join Video Call</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room ID</label>
                <input
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter room ID"
                />
              </div>
              <button
                onClick={joinCall}
                disabled={isJoining}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isJoining ? 'Joining...' : 'Join Call'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  You
                </div>
              </div>
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg bg-gray-900"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  Remote
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`px-4 py-2 rounded-md ${
                  isMuted ? 'bg-red-600' : 'bg-gray-600'
                } text-white hover:bg-opacity-80`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-md ${
                  isVideoOff ? 'bg-red-600' : 'bg-gray-600'
                } text-white hover:bg-opacity-80`}
              >
                {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
              </button>
              <button
                onClick={endCall}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 