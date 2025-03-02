import React from 'react';
import { User } from '../types';
import { MessageSquare } from 'lucide-react';

interface UserSelectionProps {
  onSelectUser: (userId: 'user1' | 'user2') => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onSelectUser }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
            <MessageSquare size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Anonymous Chat</h1>
        <p className="text-gray-600 text-center mb-8">
          Choose which user you want to be in this anonymous chat room.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectUser('user1')}
            className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
          >
            <span className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center mr-3">
              <span className="font-bold">1</span>
            </span>
            <span>Join as User 1</span>
          </button>
          
          <button
            onClick={() => onSelectUser('user2')}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3">
              <span className="font-bold">2</span>
            </span>
            <span>Join as User 2</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;