import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import ChatRoom from './components/ChatRoom';
import WelcomeScreen from './components/WelcomeScreen';
import { User, Room } from './types';

// Initialize socket connection
const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3000' : window.location.origin;
const socket: Socket = io(SOCKET_URL);

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: uuidv4(),
    name: 'Anonymous User',
    color: 'emerald',
  });
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [userCount, setUserCount] = useState<number>(1);

  // Check URL for room ID on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    
    if (roomId) {
      handleJoinRoom(roomId);
    }
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    // Handle errors
    socket.on('error', ({ message }) => {
      setError(message);
      setIsLoading(false);
    });

    // Handle room joined
    socket.on('room-joined', ({ roomId, messages = [], userCount }) => {
      setRoom({
        id: roomId,
      });
      
      setUserCount(userCount);
      setIsLoading(false);
      
      // Update URL with room ID
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      window.history.pushState({}, '', url);
    });

    // Handle user joined
    socket.on('user-joined', ({ userId, userCount }) => {
      setUserCount(userCount);
      
      // Show toast notification when another user joins
      if (userId !== currentUser.id) {
        toast.success('A new user has joined the chat!');
      }
    });

    // Handle user left
    socket.on('user-left', ({ userCount }) => {
      setUserCount(userCount);
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('error');
      socket.off('room-joined');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [currentUser.id]);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await fetch('/api/create-room');
      const data = await response.json();
      
      if (data.roomId) {
        socket.emit('join-room', {
          roomId: data.roomId,
          userId: currentUser.id
        });
      } else {
        throw new Error('Failed to create room');
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
      setIsLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    setIsLoading(true);
    setError(undefined);
    
    socket.emit('join-room', {
      roomId,
      userId: currentUser.id
    });
  };

  const handleLeaveRoom = () => {
    if (room) {
      socket.emit('leave-room', { roomId: room.id });
      
      // Clear room data
      setRoom(null);
      setUserCount(1);
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.pushState({}, '', url);
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {!room ? (
        <WelcomeScreen 
          onCreateRoom={handleCreateRoom} 
          onJoinRoom={handleJoinRoom}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <ChatRoom 
          socket={socket} 
          currentUser={currentUser} 
          room={room}
          onLeaveRoom={handleLeaveRoom}
          initialUserCount={userCount}
        />
      )}
    </>
  );
}

export default App;