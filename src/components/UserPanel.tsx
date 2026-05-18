import { Mic, Headphones, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import supabase from '../lib/supabase';
import type { Profile } from '../types';

interface UserPanelProps {
  profile: Profile | null;
}

export default function UserPanel({ profile }: UserPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="h-14 bg-[#292B2F] px-2 flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0 p-1 rounded hover:bg-[#36393F] cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm font-semibold">
              {(profile?.username || 'U')?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{profile?.username || 'User'}</p>
          <p className="text-xs text-gray-400">#{profile?.id?.slice(0, 4) || '0000'}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setIsMuted(!isMuted)} className={`w-8 h-8 rounded flex items-center justify-center transition ${isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-[#36393F] text-gray-400 hover:text-white'}`}>
          <Mic className="w-5 h-5" />
        </button>
        <button onClick={() => setIsDeafened(!isDeafened)} className={`w-8 h-8 rounded flex items-center justify-center transition ${isDeafened ? 'bg-red-500/20 text-red-400' : 'hover:bg-[#36393F] text-gray-400 hover:text-white'}`}>
          <Headphones className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded hover:bg-[#36393F] flex items-center justify-center text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
        <button onClick={handleLogout} className="w-8 h-8 rounded hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
