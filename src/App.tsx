import { useState, useEffect } from 'react';
import { handleGoogleRedirect } from './lib/googleAuth';
import supabase from './lib/supabase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ServerSidebar from './components/ServerSidebar';
import ChatArea from './components/ChatArea';
import VoiceChannel from './components/VoiceChannel';
import MemberList from './components/MemberList';
import UserPanel from './components/UserPanel';
import Discover from './components/Discover';
import type { Profile, Server, Channel, ServerMember } from './types';

handleGoogleRedirect();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [members, setMembers] = useState<ServerMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchOrCreateProfile(session.user);
        await fetchServers();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrCreateProfile = async (authUser: any) => {
    try {
      const res = await fetch(`/api/profiles/${authUser.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfile(data);
          return;
        }
      }

      const username = authUser.email?.split('@')[0] || 'User';
      const createRes = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: authUser.id,
          username,
          status: 'online',
        }),
      });
      if (createRes.ok) {
        const newProfile = await createRes.json();
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Profile error:', err);
    }
  };

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/servers');
      const data = await res.json();
      setServers(data);
    } catch (err) {
      console.error('Fetch servers error:', err);
    }
  };

  const fetchServerData = async (serverId: number) => {
    try {
      const [channelsRes, membersRes] = await Promise.all([
        fetch(`/api/channels?server_id=${serverId}`),
        fetch(`/api/server-members?server_id=${serverId}`),
      ]);
      const channelsData = await channelsRes.json();
      const membersData = await membersRes.json();
      setChannels(channelsData);
      setMembers(membersData);
      if (channelsData.length > 0) {
        setCurrentChannel(channelsData[0]);
      }
    } catch (err) {
      console.error('Fetch server data error:', err);
    }
  };

  const handleSelectServer = (server: Server) => {
    setCurrentServer(server);
    setCurrentChannel(null);
    if (server) {
      fetchServerData(server.id);
    } else {
      setChannels([]);
      setMembers([]);
    }
  };

  const handleJoinServer = async (inviteCode: string) => {
    try {
      const res = await fetch(`/api/servers/invite/${inviteCode}`);
      if (!res.ok) {
        alert('Invalid invite code');
        return;
      }
      const server = await res.json();
      const memberRes = await fetch('/api/server-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server_id: server.id, user_id: user.id, role: 'member' }),
      });
      if (memberRes.ok) {
        fetchServers();
        alert(`Joined ${server.name}!`);
      }
    } catch (err) {
      console.error('Join server error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#36393f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Aroudf11</p>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#36393f]">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          servers={servers}
          currentServer={currentServer}
          onSelectServer={handleSelectServer}
          onRefresh={fetchServers}
        />

        {currentServer ? (
          <>
            <ServerSidebar
              server={currentServer}
              channels={channels}
              currentChannel={currentChannel}
              onSelectChannel={setCurrentChannel}
              onRefresh={() => fetchServerData(currentServer.id)}
            />
            {currentChannel && (
              <>
                {currentChannel.type === 'text' ? (
                  <ChatArea
                    channel={currentChannel}
                    serverId={currentServer.id}
                    currentUser={profile}
                  />
                ) : (
                  <VoiceChannel
                    channel={currentChannel}
                    currentUser={profile}
                    onLeave={() => setCurrentChannel(null)}
                  />
                )}
                <MemberList members={members} />
              </>
            )}
          </>
        ) : (
          <Discover onJoinServer={handleJoinServer} />
        )}
      </div>

      <UserPanel profile={profile} />
    </div>
  );
}
