import { useState, useEffect, useRef } from 'react';
import { Hash, Send } from 'lucide-react';
import supabase from '../lib/supabase';
import type { Channel, Message, Profile } from '../types';

interface ChatAreaProps {
  channel: Channel;
  serverId: number;
  currentUser: Profile | null;
}

export default function ChatArea({ channel, serverId, currentUser }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel(`channel-${channel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channel.id}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        fetchProfileForMessage(newMsg);
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [channel.id]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?channel_id=${channel.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileForMessage = async (msg: Message) => {
    const res = await fetch(`/api/profiles/${msg.user_id}`);
    const profile = await res.json();
    setMessages(prev => [...prev, { ...msg, profiles: profile }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channel.id,
          user_id: currentUser.id,
          content: newMessage,
        }),
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      <div className="h-12 px-4 flex items-center border-b border-[#202225] shadow-md">
        <Hash className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-white font-semibold">{channel.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Hash className="w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to #{channel.name}!</h3>
            <p>This is the start of the #{channel.name} channel.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 hover:bg-[#32353B] px-2 py-1 rounded">
              <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                {msg.profiles?.avatar ? (
                  <img src={msg.profiles.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-semibold">
                    {(msg.profiles?.username || msg.user_id)?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-medium hover:underline cursor-pointer">
                    {msg.profiles?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(msg.created_at)} {formatTime(msg.created_at)}
                  </span>
                </div>
<p className="text-gray-300 break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="px-4 pb-6">
        <div className="bg-[#40444B] rounded-lg flex items-center px-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 bg-transparent text-gray-100 py-3 focus:outline-none"
          />
          <button type="submit" className="text-gray-400 hover:text-white p-2">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
      }
