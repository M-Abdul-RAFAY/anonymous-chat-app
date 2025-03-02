import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  isLoading: boolean;
  error?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onCreateRoom, 
  onJoinRoom,
  isLoading,
  error
}) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
            <MessageSquare size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Anonymous Chat</h1>
        <p className="text-gray-600 text-center mb-6">
          Secure, private, and anonymous conversations
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={onCreateRoom}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Creating Room...' : 'Create New Chat Room'}
          </button>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <form onSubmit={handleJoinRoom}>
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                Have an invite? Enter room ID
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !roomId.trim()}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Joining...' : 'Join Existing Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;