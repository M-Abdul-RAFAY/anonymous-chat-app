import React from 'react';
import { MessageSquare, Copy, Users, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatHeaderProps {
  userCount: number;
  roomId: string;
  onCopyLink: () => void;
  onExitChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userCount, roomId, onCopyLink, onExitChat }) => {
  return (
    <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center">
          <MessageSquare size={20} />
        </div>
        <div>
          <h1 className="font-semibold">Anonymous Chat</h1>
          <div className="flex items-center text-xs text-emerald-100">
            <Users size={12} className="mr-1" />
            <span>{userCount} {userCount === 1 ? 'user' : 'users'} online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button 
          onClick={onCopyLink}
          className="p-2 rounded-full hover:bg-emerald-500 transition-colors mr-2"
          title="Copy room ID"
        >
          <Copy size={20} />
        </button>
        <button 
          onClick={onExitChat}
          className="p-2 rounded-full hover:bg-emerald-500 transition-colors"
          title="Exit chat"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;