import { useState, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import type { Channel, Profile } from '../types';

interface VoiceChannelProps {
  channel: Channel;
  currentUser: Profile | null;
  onLeave: () => void;
}

export default function VoiceChannel({ channel, currentUser, onLeave }: VoiceChannelProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to get media:', err);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setIsConnected(false);
    onLeave();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
     });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      <div className="h-12 px-4 flex items-center border-b border-[#202225] shadow-md">
        <span className="text-white font-semibold">{channel.name}</span>
        <span className="ml-2 text-xs text-gray-400 bg-[#202225] px-2 py-0.5 rounded">Voice</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {!isConnected ? (
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-[#5865F2] flex items-center justify-center mb-6 mx-auto">
              <Video className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
            <p className="text-gray-400 mb-6">No one else is in this voice channel yet.</p>
            <button onClick={joinCall} className="bg-[#3BA55C] hover:bg-[#2F8B4A] text-white font-semibold px-8 py-3 rounded-lg transition">
              Join Voice
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="relative aspect-video bg-[#202225] rounded-lg overflow-hidden">
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                  {currentUser?.username || 'You'} (You)
                </div>
                {isVideoOff && (
                  <div className="absolute inset-0 bg-[#202225] flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#5865F2] flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {(currentUser?.username || 'Y')?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-500' : 'bg-[#2F3136] hover:bg-[#36393F]'}`}>
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>
              <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isVideoOff ? 'bg-red-500' : 'bg-[#2F3136] hover:bg-[#36393F]'}`}>
                {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
              </button>
              <button onClick={leaveCall} className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition">
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
