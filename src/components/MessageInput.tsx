import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  onFeatureNotAvailable: (feature: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  onFeatureNotAvailable,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      onTyping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    onTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 px-4 py-3">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onFeatureNotAvailable('File sharing')}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          disabled={disabled}
          placeholder={disabled ? "Waiting for connection..." : "Type a message"}
          className="flex-1 border-0 bg-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
        />
        {message.trim() ? (
          <button
            type="submit"
            disabled={disabled}
            className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onFeatureNotAvailable('Voice messages')}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </form>
  );
};

export default MessageInput;