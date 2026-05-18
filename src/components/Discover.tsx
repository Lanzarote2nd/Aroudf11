import { Globe } from 'lucide-react';
import { useState } from 'react';

interface DiscoverProps {
  onJoinServer: (inviteCode: string) => void;
}

export default function Discover({ onJoinServer }: DiscoverProps) {
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      onJoinServer(inviteCode.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      <div className="h-12 px-4 flex items-center border-b border-[#202225] shadow-md">
        <Globe className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-white font-semibold">Discover</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-full bg-[#5865F2] flex items-center justify-center mb-6">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Find your community</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">Enter an invite code below to join a server, or create your own from the sidebar!</p>

        <form onSubmit={handleJoin} className="w-full max-w-md">
          <div className="bg-[#202225] rounded-lg p-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Join a Server</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter invite code"
              className="w-full bg-[#36393f] text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
            />
            <button type="submit" disabled={!inviteCode.trim()} className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed">
              Join Server
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Made by Abdullah Ahmed Abdelaleem</p>
        </div>
      </div>
    </div>
  );
}
