import { Crown, Shield } from 'lucide-react';
import type { ServerMember } from '../types';

interface MemberListProps {
  members: ServerMember[];
}

export default function MemberList({ members }: MemberListProps) {
  const onlineMembers = members.filter(m => m.profiles?.status !== 'offline');
  const offlineMembers = members.filter(m => m.profiles?.status === 'offline');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'admin': return <Shield className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-[#3BA55C]';
      case 'idle': return 'bg-[#FAA61A]';
      case 'dnd': return 'bg-[#ED4245]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-60 bg-[#2f3136] overflow-y-auto">
      <div className="p-4">
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Online — {onlineMembers.length}</h3>
            <div className="space-y-1">
              {onlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#36393F] cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                      {member.profiles?.avatar ? (
                        <img src={member.profiles.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {(member.profiles?.username || 'U')?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2f3136] ${getStatusColor(member.profiles?.status)}`} />
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-gray-300 group-hover:text-white truncate text-sm">{member.profiles?.username || 'Unknown'}</span>
                    {getRoleIcon(member.role)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Offline — {offlineMembers.length}</h3>
            <div className="space-y-1">
              {offlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#36393F] cursor-pointer group opacity-50">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">
                      {(member.profiles?.username || 'U')?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-500 group-hover:text-gray-300 truncate text-sm">{member.profiles?.username || 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
              }
