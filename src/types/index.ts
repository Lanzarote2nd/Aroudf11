export interface Profile {
  id: string;
  username: string;
  avatar: string | null;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  created_at: string;
}

export interface Server {
  id: number;
  name: string;
  icon: string | null;
  owner_id: string;
  invite_code: string;
  created_at: string;
}

export interface Channel {
  id: number;
  server_id: number;
  name: string;
  type: 'text' | 'voice';
  created_at: string;
}

export interface Message {
  id: number;
  channel_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface ServerMember {
  id: number;
  server_id: number;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profiles?: Profile;
}
