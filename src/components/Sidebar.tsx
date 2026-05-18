import { Server, Plus, Compass, Download } from 'lucide-react';
import { useState } from 'react';
import supabase from '../lib/supabase';
import type { Server as ServerType } from '../types';

interface SidebarProps {
  servers: ServerType[];
  currentServer: ServerType | null;
  onSelectServer: (server: ServerType) => void;
  onRefresh: () => void;
}

export default function Sidebar({ servers, currentServer, onSelectServer, onRefresh }: SidebarProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(false);

  const createServer = async () => {
    if (!serverName.trim()) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const inviteCode = Math.random().toString(36).substring(2, 10);
      const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: serverName, owner_id: user.id, invite_code: inviteCode }),
      });
      if (res.ok) {
        setServerName('');
        setShowCreate(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2 overflow-y-auto">
      <button
        onClick={() => onSelectServer(null as any)}
        className="w-12 h-12 rounded-2xl bg-[#36393f] hover:bg-[#5865F2] hover:rounded-xl flex items-center justify-center transition-all duration-200 group"
      >
        <Compass className="w-6 h-6 text-gray-400 group-hover:text-white" />
      </button>

      <div className="w-8 h-0.5 bg-[#36393f] rounded-full my-1" />

      {servers.map((server) => (
        <button
          key={server.id}
          onClick={() => onSelectServer(server)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group relative ${
            currentServer?.id === server.id
              ? 'bg-[#5865F2] rounded-xl'
              : 'bg-[#36393f] hover:bg-[#5865F2] hover:rounded-xl'
          }`}
       >
          {server.icon ? (
            <img src={server.icon} alt={server.name} className="w-full h-full rounded-xl object-cover" />
          ) : (
            <span className="text-white font-semibold text-lg">
              {server.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      ))}

      <button
        onClick={() => setShowCreate(true)}
        className="w-12 h-12 rounded-2xl bg-[#36393f] hover:bg-[#3BA55C] hover:rounded-xl flex items-center justify-center transition-all duration-200 group"
      >
        <Plus className="w-6 h-6 text-[#3BA55C] group-hover:text-white" />
      </button>

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-[#36393f] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-2">Create a server</h2>
            <p className="text-gray-400 mb-4">Your server is where you and your friends hang out.</p>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Server name"
              className="w-full bg-[#202225] text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2 text-gray-400 hover:underline">Cancel</button>
              <button onClick={createServer} disabled={loading} className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 rounded transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
            }
