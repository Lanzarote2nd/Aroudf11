import { Hash, Volume2, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import type { Channel, Server } from '../types';

interface ServerSidebarProps {
  server: Server;
  channels: Channel[];
  currentChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  onRefresh: () => void;
}

export default function ServerSidebar({ server, channels, currentChannel, onSelectChannel, onRefresh }: ServerSidebarProps) {
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [loading, setLoading] = useState(false);

  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  const createChannel = async () => {
    if (!channelName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server_id: server.id, name: channelName, type: channelType }),
      });
      if (res.ok) {
        setChannelName('');
        setShowCreateChannel(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${server.invite_code}`);
    alert('Invite link copied!');
  };

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-md">
        <h2 className="text-white font-semibold truncate">{server.name}</h2>
        <UserPlus className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" onClick={copyInvite} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Text Channels</span>
            <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" onClick={() => { setChannelType('text'); setShowCreateChannel(true); }} />
          </div>
{textChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectChannel(channel)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition ${
                currentChannel?.id === channel.id ? 'bg-[#40444B] text-white' : 'text-gray-400 hover:bg-[#3A3C43] hover:text-gray-200'
              }`}
            >
              <Hash className="w-5 h-5" />
              {channel.name}
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Voice Channels</span>
            <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" onClick={() => { setChannelType('voice'); setShowCreateChannel(true); }} />
          </div>
          {voiceChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectChannel(channel)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition ${
                currentChannel?.id === channel.id ? 'bg-[#40444B] text-white' : 'text-gray-400 hover:bg-[#3A3C43] hover:text-gray-200'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              {channel.name}
            </button>
          ))}
        </div>
      </div>

      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowCreateChannel(false)}>
          <div className="bg-[#36393f] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Create {channelType} channel</h2>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full bg-[#202225] text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreateChannel(false)} className="flex-1 py-2 text-gray-400 hover:underline">Cancel</button>
              <button onClick={createChannel} disabled={loading} className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 rounded transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
        }
