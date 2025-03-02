import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Message, User, Room } from '../types';

interface ChatRoomProps {
  socket: Socket;
  currentUser: User;
  room: Room;
  onLeaveRoom: () => void;
  initialUserCount: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  socket, 
  currentUser, 
  room, 
  onLeaveRoom,
  initialUserCount
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(initialUserCount);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [showWelcomeBox, setShowWelcomeBox] = useState(initialUserCount <= 1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherUserTyping]);

  // Set up socket event listeners
  useEffect(() => {
    // Handle user joined event
    socket.on('user-joined', ({ userCount: count }) => {
      setUserCount(count);
      // Hide welcome box when more than one user is connected
      if (count > 1) {
        setShowWelcomeBox(false);
      }
    });

    // Handle receiving messages
    socket.on('receive-message', (message: Message) => {
      setMessages(prev => [...prev, { ...message, timestamp: new Date(message.timestamp) }]);
      // Hide welcome box when messages start flowing
      setShowWelcomeBox(false);
    });

    // Handle typing indicator
    socket.on('user-typing', ({ userId, isTyping }) => {
      if (userId !== currentUser.id) {
        setIsOtherUserTyping(isTyping);
      }
    });

    // Handle user left
    socket.on('user-left', ({ userCount: count }) => {
      setUserCount(count);
      toast.success('A user has left the chat');
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('user-joined');
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('user-left');
    };
  }, [socket, currentUser.id]);

  // Update showWelcomeBox when initialUserCount changes
  useEffect(() => {
    if (initialUserCount > 1) {
      setShowWelcomeBox(false);
    }
    setUserCount(initialUserCount);
  }, [initialUserCount]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      text: text,
      sender: currentUser.id,
      timestamp: new Date(),
      encrypted: false,
    };
    
    // Send to server
    socket.emit('send-message', newMessage);
  };

  const handleTyping = (isTyping: boolean) => {
    socket.emit('typing', {
      roomId: room.id,
      userId: currentUser.id,
      isTyping,
    });
  };

  const handleCopyLink = () => {
    // Copy only the room ID instead of the full URL
    navigator.clipboard.writeText(room.id)
      .then(() => {
        toast.success('Room ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy room ID:', err);
        toast.error('Failed to copy room ID');
      });
  };

  const handleFeatureNotAvailable = (feature: string) => {
    toast.success(`${feature} feature is coming soon!`, {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader 
        userCount={userCount}
        roomId={room.id}
        onCopyLink={handleCopyLink}
        onExitChat={onLeaveRoom}
      />
      
      <div className="flex-1 bg-gray-200 p-4 overflow-y-auto">
        {messages.length === 0 && showWelcomeBox ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Chat Room Active</h2>
              <p className="text-gray-600 mb-4">
                {userCount > 1 
                  ? `${userCount} users in this room. Start chatting!` 
                  : 'You\'re the only one here. Invite others to join!'}
              </p>
              <button 
                onClick={handleCopyLink}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Copy Room ID
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.sender === currentUser.id}
              />
            ))}
            {isOtherUserTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onTyping={handleTyping}
        onFeatureNotAvailable={handleFeatureNotAvailable}
      />
    </div>
  );
};

export default ChatRoom;